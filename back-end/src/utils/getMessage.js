import messages from "../constants/message.js";

function getMessage(lang = 'en', type, key) {
  // Kiểm tra xem ngôn ngữ có tồn tại không, nếu không thì mặc định là 'en'
  const localizedMessages = messages[lang] || messages['en'];
  // Lấy thông báo theo type (success/error) và key
  return localizedMessages[type]?.[key] || 'Message not found!';
}

export default getMessage; 