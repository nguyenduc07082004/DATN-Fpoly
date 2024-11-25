export const removeVietnameseTones = (str: string) => {
    const vietnameseMap: { [key: string]: string } = {
      a: "áàảãạăắằẳẵặâấầẩẫậ",
      e: "éèẻẽẹêếềểễệ",
      i: "íìỉĩị",
      o: "óòỏõọôốồổỗộơớờởỡợ",
      u: "úùủũụưứừửữự",
      y: "ýỳỷỹỵ",
      d: "đ",
    };
  
    let result = str.toLowerCase();
  
    Object.keys(vietnameseMap).forEach((key) => {
      vietnameseMap[key].split("").forEach((char) => {
        result = result.replace(new RegExp(char, "g"), key);
      });
    });
  
    return result;
  };
  
  export const generateSlug = (name: string) => {
    const nameWithoutTones = removeVietnameseTones(name); 
    return nameWithoutTones
      .toLowerCase()
      .replace(/\s+/g, "-") 
      .replace(/[^\w\-]+/g, "") 
      .replace(/--+/g, "-") 
      .replace(/^-+|-+$/g, "");
  };
  