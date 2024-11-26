import React from "react";

const CheckOut = () => {
  return (
    <div className="text-center my-5">
      <div className="py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-box2-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6z" />
        </svg>
      </div>
      <h3>Đơn hàng sẽ sớm được gửi đến bạn</h3>
    </div>
  );
};

export default CheckOut;
