export const formatDate = (dateStr:Date) => {
    const date = new Date(dateStr);
     const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      // Chỉ giờ:phút
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      // Hiện thêm ngày/tháng/năm
      return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString(
        'en-GB',
        { hour: '2-digit', minute: '2-digit' }
      )}`;
    }
}