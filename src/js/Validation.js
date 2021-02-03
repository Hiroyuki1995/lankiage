const requiredValidation = (item) => {
  if (!item) {
    return '入力してください';
  }

  // const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  // if (!regex.test(email)) return '正しい形式でメールアドレスを入力してください';

  return '';
};

// const passwordValidation = (password: string): string => {
//   if (!password) return 'パスワードを入力してください';
//   if (password.length < 8) return 'パスワードは8文字以上で入力してください';

//   return '';
// };

class Validation {
  static formValidate = (type, value) => {
    switch (type) {
      case 'frontWord':
      case 'backWord':
      case 'frontLang':
      case 'backLang':
        return requiredValidation(value);
    }
  };
}

export default Validation;
