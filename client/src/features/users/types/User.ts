export enum UserStatus {
    Active = "Active",
    Deleted = "Deleted"
}

export type User = {
    Username: string,
    Status: UserStatus,
    Vars: unknown,
    CreateDate: Date,
    ModifyDate: Date
}

export const convertToUser = (data : unknown) => {
    const userData = data as {
        username: string,
        status: string,
        vars: unknown,
        createDate: string,
        modifyDate: string
    };
    const user = {} as User;    
    user.Username = userData?.username?.toString();
    user.Status = userData?.status as UserStatus;    
    user.Vars = userData?.vars;
    user.CreateDate = new Date(userData?.createDate);
    user.ModifyDate = new Date(userData?.modifyDate);
    return user;
}

export const getUserStatusColor = (status: UserStatus) : string => {
    switch (status) {        
        case UserStatus.Active:
            return "green";        
        case UserStatus.Deleted:
            return "gray";				
    }
    return "";
}

export const convertDataToUserList = (listData : unknown) => {
    const list = [] as User[];
    if (listData instanceof Array) {
        for (let i = 0; i < listData.length; i++) {				
            const u = convertToUser(listData[i]);
            if (u != null && u.Username != null) {
                list.push(u);
            }
        }
    }
    return list;
};

export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;

export const isValidUser = (user: User) => {    
    if (user == null || user.Username == null) return false;    
    if (!USERNAME_PATTERN.test(user.Username)) return false;
    return true;
}