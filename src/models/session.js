class Session {
    constructor(args){
        this.uid = args.uid
        this.user = args.user
        this.expires = args.expires
    }

    isExpired(){
        return Date.now() > this.expires
    } 
}

export default Session