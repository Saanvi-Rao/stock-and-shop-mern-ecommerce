const verifyEmailTemplate = ({name,url})=>{
    return`

<p>Dear ${name}</p>    
<p>Thank you for registering in Stock And Shop</p>
   
<a href=${url} style="color:black;background :orange;margin-top : 10px,padding:20px,display:block">
    Verify Your Email
</a>
`
}

export default verifyEmailTemplate