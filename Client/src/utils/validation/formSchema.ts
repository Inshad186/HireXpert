import { nameRegex, emailRegex, passwordRegex } from "./regex.util";
import { responses } from "@/constants/response.constants";

export const formSchema = {
    name : {
        rules : [nameRegex],
        messages : [responses.INVALID_NAME]
    },
    email : {
        rules : [emailRegex],
        messages : [responses.INVALID_EMAIL]
    },
    password : {
        rules : [
            passwordRegex.length,
            passwordRegex.letter,
            passwordRegex.digit,
            passwordRegex.specialChar
        ],
        messages : [
            responses.PASSWORD_LENGTH,
            responses.PASSWORD_LETTER,
            responses.PASSWORD_DIGIT,
            responses.PASSWORD_SPECIALCHAR
        ]
    },
}

