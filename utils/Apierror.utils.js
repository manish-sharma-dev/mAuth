class Apierror extends Error{
    constructor(
        status,
        msg,
        error
    ){
        super(msg)
        this.status = status
        this.msg = msg
        this.error = error
    }
}

export { Apierror }