using System.Net;
using System.Net.Sockets;
using Consul;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace API.Discovery;

public class AutoDiscoveryService : IHostedService {

    public const string DEFAULT_CONSUL_URL = "http://localhost:8500";
    
    public ILogger<AutoDiscoveryService> _logger;

    public IServer _server;

    private IConfiguration _configuration;

    private IHostApplicationLifetime _applicationLifetime;

    public AutoDiscoveryService(ILogger<AutoDiscoveryService> logger, IServer server, IConfiguration configuration, IHostApplicationLifetime applicationLifetime)
    {
        _logger = logger;
        _server = server;
        _applicationLifetime = applicationLifetime;
        _configuration = configuration;
    }

    public Task StartAsync(CancellationToken stoppingToken)
    {
        _applicationLifetime.ApplicationStarted.Register(OnApplicationStarted);        
        return Task.CompletedTask;
    }   

    public Task StopAsync(CancellationToken stoppingToken)
    {          
        using (var consulClient = GetConsulClient()) 
        {       
            try {     
                consulClient.Agent.ServiceDeregister(GetServiceId(), stoppingToken);            
            } catch (Exception ex) {
                _logger.LogError(ex, "Erron on ConsulClient.ServiceDeregister");
            }
        }     
        return Task.CompletedTask;
    }
    
    private async void OnApplicationStarted() {        
        try {
            await this.RegisterWithConsul(GetServiceUrl());        
        } catch (UriFormatException ex) {
            _logger.LogError(ex, $"{GetServiceUrl()} is not a properly formatted Uri");        
        } catch (Exception ex) {
            _logger.LogError(ex, "Error on RegisterWithConsul call");
        }
    }
    
    public async Task RegisterWithConsul(string? address)
    {
        if (address == null) {
            _logger.LogWarning($"Address cannot be empty for registering with Consul");
            return;
        }
        _logger.LogInformation($"Registering {address} with Consul");               
        
        using (var consulClient = GetConsulClient()) {            
            try {
                var rslt = await consulClient.Agent.ServiceRegister(GetAgentServiceRegistration(address));
                if (rslt.StatusCode == HttpStatusCode.OK) {
                    _logger.LogInformation($"{address} successfully registered with Consul");
                } else {
                    _logger.LogWarning($"Consul responded with {rslt.StatusCode} on registering {address} service.");
                }
            } catch (Exception ex) {
                _logger.LogError(ex, "Error on ConsulClient.ServiceRegister call");
            }
        }
    }

    private ConsulClient GetConsulClient() {        
        return new ConsulClient(new ConsulClientConfiguration() {
            Address = new Uri(_configuration["Consul:Address"] ?? DEFAULT_CONSUL_URL)
        });  
    }

    private AgentServiceRegistration GetAgentServiceRegistration(string address) {
        var uri = new Uri(address);
        var registration = new AgentServiceRegistration() {
            ID = GetServiceId(), // must be an unique ID                
            Name = GetServiceId(),
            Address = uri.Host,
            Port = uri.Port                
        };
        if (_configuration["Consul:HealthCheck"] != null) {
            registration.Check = new AgentServiceCheck()  {
                HTTP = $"{address}/{_configuration["Consul:HealthCheck"] ?? "health"}",
                Interval = TimeSpan.FromSeconds(10)
            };
        }
        return registration;
    }

    private string GetServiceId() {
        return _configuration["Consul:ServiceID"] ?? System.AppDomain.CurrentDomain.FriendlyName;
    }

    private string? GetServiceUrl() {
        var serverAddressesFeature = _server.Features.Get<IServerAddressesFeature>();         
        var serviceUrl = 
            serverAddressesFeature!.Addresses.FirstOrDefault(x => x.StartsWith("http:")) ??
            serverAddressesFeature!.Addresses.FirstOrDefault(x => x.StartsWith("https:"));            
        if (serviceUrl != null && serviceUrl.Contains("[::]")) {
            var hostName = Dns.GetHostName(); 
            var hostIP = Dns.GetHostEntry(hostName).AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork)?.ToString();
            serviceUrl = serviceUrl.Replace("[::]", hostIP);
        }
        if (serviceUrl != null && _configuration["Consul:Rename:From"] != null && _configuration["Consul:Rename:To"] != null) {
            serviceUrl = serviceUrl.Replace(_configuration["Consul:Rename:From"]!, _configuration["Consul:Rename:To"]);
        }
        return serviceUrl;
    }
}