// import * as AuthService from '../services/auth.js'

// class UserSchema {
//     constructor(args){   
//         this.uid  = args.uid
//         this.email = args.email 
//         this.fullname = args.fullname 
//         this.password = args.password
//         this.initials = args.initials 
//         this.image = args.image
//         this.created_at = args.created_at
//         this.updated_at = args.updated_at
//         this.isTrial = args.isTrial
//         this.role = args.role
//         this.organizations = args.organizations
//     }
// }

// class User extends UserSchema {
//     constructor(args){
//         super(args)
//     }

//     checkPassword(password){
//         return AuthService.checkPassword({
//             user: this,
//             password
//         })
//     }
    
//     // addOrganization({ name }){
//     //     return OrganizationService.create({
//     //         user: this,
//     //         name
//     //     })
//     // }
// }

// export default User