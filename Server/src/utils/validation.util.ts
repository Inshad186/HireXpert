import { nameRegex, emailRegex , passwordRegex } from "./regex.util";
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
};

const loginValidation = {
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
        ],
    },
}

export { signupValidation, loginValidation }




export const isHttpUrl = (value: string, hostEndsWith?: string): boolean => {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (url.username || url.password) return false;
    if (!hostEndsWith) return true;

    const host = url.hostname;
    return host === hostEndsWith || host.endsWith(`.${hostEndsWith}`);
  } catch {
    return false;
  }
};