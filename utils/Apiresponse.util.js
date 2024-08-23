class Apiresponse{
    constructor(
        status,
        msg,
        data = data?data:{ }
    ) { 

        this.status = status
        this.msg = msg
        this.data = data

    }
}

export { Apiresponse }