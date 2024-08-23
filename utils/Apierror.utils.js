class Apierror extends Error{
    constructor(
        status,
        msg,
        error= error?error:"Something Went wrong, can't locate the error"
    ){
        this.status = status
        this.msg = msg
        this.error = error
    }
}

export { Apierror }