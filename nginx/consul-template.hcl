consul {
    address = "http://consul:8500"
    
    retry {
        attempts = 5
        backoff = "2s"
        max_backoff = "30s"
    }
}

# This block defines the template to be rendered
template {
    source      = "/etc/consul-template/nginx.conf.ctmpl"
    destination = "/etc/nginx/nginx.conf"
    command     = "nginx -s reload"
}