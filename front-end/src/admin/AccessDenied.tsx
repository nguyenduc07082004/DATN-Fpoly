const AccessDenied = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-danger">403</h1>
              <p className="card-text">Bạn không có quyền vào trang này.</p>
              <a href="/" className="btn btn-primary">
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
