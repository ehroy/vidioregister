const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
const readline = require("readline-sync");
const SMSActivate = require("./lib/index");
const chalk = require("chalk");
const delay = require("delay");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { faker } = require("@faker-js/faker");
const fs = require("fs-extra");
const apikey = "";
const curl = ({ endpoint, data, header, proxy }) =>
  new Promise((resolve, reject) => {
    let fetchData = {
      headers: header,
      agent: new HttpsProxyAgent(proxy),
    };
    // console.log(fetchData);
    if (data) {
      fetchData.method = "POST";
      fetchData.body = data;
    } else {
      fetchData.method = "GET";
    }
    fetch(endpoint, fetchData)
      .then((res) => res)
      .then(async (res) => {
        const data = {
          cookie: await res.headers.raw(),
          respon: await res.json(),
          status: await res.status,
        };
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
function log(respon, jam = true) {
  if (jam) {
    var jamku = `[ ${chalk.blue(
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    )} ]  =>`;
  } else {
    var jamku = "";
  }
  return process.stdout.write(`${jamku} ${respon}`);
}
function headers(visitor, token, email) {
  if (!token) {
    return {
      Host: "api.vidio.com",
      "X-VISITOR-ID": visitor,
      "X-API-App-Info": "ios/iOS16.7.5/6.26.0-2105",
      Accept: "*/*",
      "Accept-Language": "id",
      "X-API-Platform": "app-ios",
      "User-Agent": "vidioios/6.26.0 2105",
      Referer: "ios-app://com.kmk.vidio",
      Connection: "keep-alive",
      "X-API-Auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "Content-Type": "application/json",
    };
  } else {
    return {
      Host: "api.vidio.com",
      "X-VISITOR-ID": visitor,
      "X-API-App-Info": "ios/iOS16.7.5/6.26.0-2105",
      Accept: "*/*",
      "X-USER-EMAIL": email,
      "Accept-Language": "id",
      "X-API-Platform": "app-ios",
      "User-Agent": "vidioios/6.26.0 2105",
      Referer: "ios-app://com.kmk.vidio",
      Connection: "keep-alive",
      "X-USER-TOKEN": token,
      "X-API-Auth": "laZOmogezono5ogekaso5oz4Mezimew1",
      "Content-Type": "application/json",
    };
  }
}
(async () => {
   const Phone = readline.question(
        chalk.yellowBright(`[ ???? ] `) +
          "Input Number Not Include ( 62 or 0 ) : "
      );
   const password = readline.question(
        chalk.yellowBright(`[ ???? ] `) +
          "Input Password : "
      );
  while (true) {
    const Generate =
      faker.person.lastName() +
      faker.person.firstName() +
      faker.person.lastName() +
      "@gmail.com";

    const email = Generate;
   
    const proxyauth =
      "http://oreotwistt:bebasszz_country-us@geo.iproyal.com:12321";
    let dataip;
    do {
      try {
        dataip = await curl({
          endpoint: "https://api.ipify.org?format=json",
          data: null,
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
          },
          proxy: proxyauth,
        });
        // console.log(dataip);
      } catch (error) {
        console.log(error);
        console.log(
          chalk.yellowBright(`[ INFO ] `) + chalk.greenBright("Proxy Not Found")
        );
      }
    } while (!dataip);
    console.log(
      chalk.yellowBright(`[ INFO ] `) +
        chalk.greenBright("Data Proxy : " + dataip.respon.ip)
    );
    const visitor = uuidv4().toLocaleUpperCase();
    const Register = await curl({
      endpoint: "https://api.vidio.com/api/register",
      data: JSON.stringify({
        email: email,
        password: password,
      }),
      header: headers(visitor, null),
      proxy: proxyauth,
    });
    if (JSON.stringify(Register.respon).includes("access_token")) {
      console.log(
        chalk.yellowBright(`[ INFO ] `) + "Token Successfuly Create.."
      );
      console.log(
        chalk.yellowBright(`[ INFO ] `) +
          `Account :\n      - Email : ${Register.respon.auth.email}\n      - Status : ${Register.respon.auth.active}\n      - Password : ${password}\n`
      );
      fs.appendFileSync("accountregister.txt", `${email}|${password}\n`);
     
      const Sendverify = await curl({
        endpoint:
          "https://api.vidio.com/api/profile/phone/send_verification_code",
        data: JSON.stringify({ phone: Phone }),
        header: headers(
          visitor,
          Register.respon.auth.authentication_token,
          Register.respon.auth.email
        ),
        proxy: proxyauth,
      });
      if (Sendverify.respon.message === "Kode verifikasi Anda telah dikirim") {
        console.log(
          chalk.yellowBright(`[ INFO ] `) + Sendverify.respon.message
        );
        const OtpInput = readline.question(
          chalk.yellowBright(`[ ???? ] `) + "Input Otp : "
        );
        const VerifyOtp = await curl({
          endpoint: "https://api.vidio.com/api/profile/phone/verify",
          data: JSON.stringify({ verification_code: OtpInput }),
          header: headers(
            visitor,
            Register.respon.auth.authentication_token,
            Register.respon.auth.email
          ),
          proxy: proxyauth,
        });
        if (VerifyOtp.respon.message === "Verifikasi nomor telepon berhasil") {
          console.log(
            chalk.yellowBright(`[ INFO ] `) + VerifyOtp.respon.message
          );
          const SwitchNumber = readline.question(
            chalk.yellowBright(`[ ???? ] `) +
              "Ganti Number With Sms Hub [y/t] :"
          );
          if (SwitchNumber.toLocaleLowerCase() === "y") {
            const sms = new SMSActivate(apikey, "smshub");
            const balance = await sms.getBalance();
            console.log(
              chalk.yellowBright(`[ INFO ] `) + `Saldo SMSHUB ${balance} руб`
            );

            let data;
            try {
              do {
                data = await sms.getNumber("fv", 6, "axis");
                // console.log(data);
              } while (data === null);
            } catch (err) {
              console.log(
                chalk.yellowBright(`[ INFO ] `) +
                  `Gagal Mendapatkan Nomer ${err}`
              );
              await delay(5000);
              continue;
            }
            let { id, number } = data;
            await sms.setStatus(id, 1);
            console.log(
              chalk.yellowBright(`[ INFO ] `) +
                `Try To Create With Number [ ${number} ]`
            );
            const PhoneNumber = number.toString().split("628")[1];
            const SendverifySmsHub = await curl({
              endpoint:
                "https://api.vidio.com/api/profile/phone/send_verification_code",
              data: JSON.stringify({ phone: "8" + PhoneNumber }),
              header: headers(
                visitor,
                Register.respon.auth.authentication_token,
                Register.respon.auth.email
              ),
              proxy: proxyauth,
            });
            if (
              SendverifySmsHub.respon.message ===
              "Kode verifikasi Anda telah dikirim"
            ) {
              console.log(
                chalk.yellowBright(`[ INFO ] `) +
                  SendverifySmsHub.respon.message,
                "With Sms Hub"
              );

              let otpCode;
              let count = 0;
              do {
                otpCode = await sms.getCode(id);
                // console.log(otpCode);
                if (count === 360) {
                  await sms.setStatus(id, 8);
                }
                await delay(1000);
                count++;
                // console.log(otpCode);
              } while (otpCode === "STATUS_WAIT_CODE");
              if (otpCode === "STATUS_CANCEL") {
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + "Cancel Phone Number"
                );
                continue;
              } else {
                otp = otpCode;
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + ("SMS OTP : " + otp)
                );
              }
              const VerifyOtpHub = await curl({
                endpoint: "https://api.vidio.com/api/profile/phone/verify",
                data: JSON.stringify({ verification_code: otpCode }),
                header: headers(
                  visitor,
                  Register.respon.auth.authentication_token,
                  Register.respon.auth.email
                ),
                proxy: proxyauth,
              });
              if (
                VerifyOtpHub.respon.message ===
                "Verifikasi nomor telepon berhasil"
              ) {
                console.log(
                  chalk.yellowBright(`[ INFO ] `) + VerifyOtpHub.respon.message,
                  "With Sms Hub"
                );
              } else {
                console.log(
                  chalk.redBright(`[ INFO ] `) + VerifyOtpHub.respon.message,
                  "With Sms Hub"
                );
              }
            } else {
              console.log(
                chalk.redBright(`[ INFO ] `) + SendverifySmsHub.respon.message,
                "With Sms Hub"
              );
            }
          } else {
            console.log(
              chalk.redBright(`[ INFO ] `) + "Skip Verify With Sms Hub"
            );
          }
        } else {
          console.log(chalk.redBright(`[ INFO ] `) + VerifyOtp.respon.message);
        }
      } else {
        console.log(chalk.redBright(`[ INFO ] `) + Sendverify.respon.message);
      }
    } else {
      console.log(
        chalk.redBright(`[ INFO ] `) + "Token Not Successfuly Create.."
      );
    }
    console.log("");
  }
})();
