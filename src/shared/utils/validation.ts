export const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateUsername = (username: string) => {
  if (!username) {
    return "Введите имя пользователя";
  }
  if (username.length < 8) {
    return "Имя пользователя должно содержать минимум 8 символов";
  }
  return null;
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Введите пароль";
  }
  if (password.length < 8) {
    return "Пароль должен содержать минимум 8 символов";
  }
  if (!passwordRegex.test(password)) {
    return "Пароль должен содержать минимум 1 заглавную букву и 1 цифру";
  }
  return null;
};

export const validatePasswordConfirmation = (password: string, confirmation: string) => {
  if (!confirmation) {
    return "Подтвердите пароль";
  }
  if (password !== confirmation) {
    return "Пароли не совпадают";
  }
  return null;
};
