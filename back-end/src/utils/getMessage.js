import messages from "../constants/message.js";

function getMessage(lang = 'vi', type, key) {
  // Kiểm tra xem ngôn ngữ có tồn tại không, nếu không thì mặc định là 'en'
  const localizedMessages = messages[lang] || messages['vi'];
  // Lấy thông báo theo type (success/error) và key
  return localizedMessages[type]?.[key] || 'Không tìm thấy thông báo!';
}

export default getMessage; 