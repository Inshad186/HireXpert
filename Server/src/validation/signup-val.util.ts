import { nameRegex, emailRegex , passwordRegex } from "../validation/regex.util";
import { HttpResponse } from "@/constants/response.constant";

const signupValidation = {
    name : {
        rules : [nameRegex],
        messages : [HttpResponse.INVALID_CREDENTIALS]
    },
    email : {
        rules : [emailRegex],
        messages : [HttpResponse.INVALID_EMAIL]
    },
    password : {
        rules : [
            passwordRegex.length,
            passwordRegex.letter,
            passwordRegex.digit,
            passwordRegex.specialChar
        ],
        messages : [
            HttpResponse.PASSWORD_LENGTH,
            HttpResponse.PASSWORD_LETTER,
            HttpResponse.PASSWORD_DIGIT,
            HttpResponse.PASSWORD_SPECIALCHAR
        ]
    }
}

export default signupValidation