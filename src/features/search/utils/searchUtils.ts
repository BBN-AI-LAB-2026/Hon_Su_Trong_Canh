/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu và chữ hoa/thường
 */
export function removeVietnameseTones(str: string): string {
  let res = str.toLowerCase();
  res = res.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  res = res.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  res = res.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  res = res.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  res = res.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  res = res.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  res = res.replace(/đ/g, 'd');
  res = res.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return res.trim();
}
