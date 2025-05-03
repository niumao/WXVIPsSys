// 模拟用户角色管理
let currentUserRole = 'user'; // 默认为普通用户

export const setUserRole = (role) => {
  currentUserRole = role;
};

export const getUserRole = () => {
  return currentUserRole;
};

export const isAdmin = () => {
  return currentUserRole === 'admin';
};

export const isUser = () => {
  return currentUserRole === 'user';
}; 