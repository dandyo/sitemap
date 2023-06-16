function UrlForm() {
    return (
        <>
            <form>
                <div className="form-group mb-3">
                    <input type="text" className="form-control" placeholder="URL" />
                </div>
                <div className="form-group mb-3">
                    <input type="text" className="form-control" placeholder="Custom folder" />
                </div>
            </form>
        </>
    );
}
export default UrlForm;