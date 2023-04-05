const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51MmyyDKnGwuMyNJVGYOxw1p1r4VzAouPnvaaBw7bclkPUDWrhlgKlAnf0oATwx77Wc4UT9VMCQKhxHsexWcTv4bG00L3tRbrvV");
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');

router.use(cors({ origin: "http://localhost:3000" }));
router.use(express.json());

// Serve static files
router.use(express.static(path.join(__dirname, 'build')));

// Catch-all route
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  }
});

router.post("/api/checkout", async (req, res) => {
  // we can get more data to find in db
  const { id, amount, property, renter, startDate, endDate } = req.body;

  try {
    console.log("Payment Request Received! ", amount)
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: `Booking for property ${property._id}`, // Update the description with the relevant property ID
      payment_method: id,
      confirm: true, //confirm the payment at the same time
    });

    const message = {
      from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
      to: renter.email,
      subject: `Booking Confirmation for property ${property.title} from ${startDate} to ${endDate}`,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        
        <!-- JUNE 2019: PLEASE ADD THE FOLLOWING LINE: -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <!-- JUNE 2019: END --> 
        
        <title>atmine</title>
        
        <!-- ///// The below code fixes the DPI Scaling issue in Outlook 2007-2013 ///// -->
        <!--[if gte mso 9]><xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml><![endif]-->
        
        <style type="text/css">
        /* ///// RESET STYLES ///// */
        body, #bodyTable, #bodyCell { width: 100% !important; height: 100% !important; margin: 0; padding: 0; line-height: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        
        /* JUNE 2019: PLEASE **DELETE** THE FOLLOWING LINE: */  
        /*table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }*/
        /* JUNE 2019: END */
        
        /* JUNE 2019: PLEASE **ADD** THE FOLLOWING LINE: */  
        table td { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
        /* JUNE 2019: END */
        
        img, a img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
        p { margin: 1em 0; }
        
        /* JUNE 2019: PLEASE DELETE THE FOLLOWING LINE. */ 
        /*table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }*/
        /* JUNE 2019: END */
        
        a { color: #c00d0d; }
        /* ///// CLIENT-SPECIFIC STYLES ///// */
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; } /* ///// Force Hotmail/Outlook.com to display at full width. ///// */
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } /* ///// Force Hotmail/Outlook.com to display line heights normally. ///// */
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } /* ///// Remove spacing between tables in Outlook 2007 and up. ///// */
        #outlook a { padding: 0; } /* ///// Force Outlook 2007 and up to provide a "view in browser" message. ///// */
        img { -ms-interpolation-mode: bicubic; } /* ///// Force IE to smoothly render resized images. ///// */
        body, table, td, p, a, li, blockquote { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } /* ///// Prevent Windows- and Webkit-based mobile platforms from changing declared text sizes. ///// */
        body { margin: 0 auto !important; }
        div[style*="margin:16px 0"] { margin: 0 !important; } /* ///// Removes left margin on Android 4.4 ///// */
        /* ///// Forces iOS devices not to highlight address/numbers ///// */
        .appleLinksW a { color: #ffffff; text-decoration: none; pointer-events: auto; cursor: default; } /* ///// White ///// */
        .appleLinksGP a { color: #53565a; text-decoration: none; pointer-events: auto; cursor: default; } /* ///// Grey (Paragraph) ///// */
        .appleLinksGF a { color: #7e7e7e; text-decoration: none; pointer-events: auto; cursor: default; } /* ///// Grey (Footer) ///// */
        .appleLinksGV a { color: #191919; text-decoration: none; pointer-events: auto; cursor: default; } /* ///// Grey (Footer) ///// */
        .appleLinksB a { color: #002a5c; text-decoration: none; pointer-events: auto; cursor: default; } /* ///// Blue (Titles/CTA) ///// */
        
        @media only screen and (max-width:599px) {
        /* ///// DEFAULT STYLING ///// */
        .fl, div:not(.container) .fl { float: left !important; } /* ///// Float elements left ///// */
        .fr, div:not(.container) .fr { float: right !important; } /* ///// Float elements right ///// */
        .dbl, div:not(.container) .dbl { display: block !important; } /* ///// Displays an element as a block element ///// */
        .din, div:not(.container) .din { display: inline !important; } /* ///// Displays an element as an inline element ///// */
        .h, div:not(.container) .h { display: none !important; } /* ///// Hides elements ///// */
        .mob, div:not(.container) .mob { float: left !important; display: block !important; width: 100% !important; }
        /* ///// TEXT OVERRIDES ///// */
        .aLeft, div:not(.container) .aLeft { text-align: left !important; } /* ///// Aligns text left ///// */
        .aRight, div:not(.container) .aRight { text-align: right !important; } /* ///// Aligns text right ///// */
        .aCenter, div:not(.container) .aCenter { text-align: center !important; } /* ///// Centers the text ///// */
        .bold, div:not(.container) .bold { font-weight: bold !important; } /* ///// Forces text to display bold ///// */
        .nBold, div:not(.container) .nBold { font-weight: normal !important; } /* ///// Forces text not to display bold ///// */
        .noUline, div:not(.container) .noUline { text-decoration: none !important; } /* ///// Text Decoration set to none ///// */
        .uline, div:not(.container) .uline { text-decoration: underline !important; } /* ///// Text Decoration set to underline ///// */
        /* ///// ADJUSTING TABLE SIZES ///// */
        .widthauto, div:not(.container) .widthauto { width: auto !important; }
        .width100, div:not(.container) .width100 { width: 100% !important; }
        .width95, div:not(.container) .width95 { width: 95% !important; }
        .width90, div:not(.container) .width90 { width: 90% !important; }
        .width80, div:not(.container) .width80 { width: 80% !important; }
        .width70, div:not(.container) .width70 { width: 70% !important; }
        .width60, div:not(.container) .width60 { width: 60% !important; }
        .width50, div:not(.container) .width50 { width: 50% !important; }
        .width40, div:not(.container) .width40 { width: 40% !important; }
        .width30, div:not(.container) .width30 { width: 30% !important; }
        .width25, div:not(.container) .width25 { width: 25% !important; }
        .width20, div:not(.container) .width20 { width: 20% !important; }
        .width11, div:not(.container) .width11 { width: 11% !important; }
        .width10, div:not(.container) .width10 { width: 10% !important; }
        .width0, div:not(.container) .width0 { width: 0% !important; }
        .heightAuto, div:not(.container) .heightAuto { height: auto !important; }
        .height100, div:not(.container) .height100 { height: 100% !important; }
        .height0, div:not(.container) .height0 { height: 0% !important; }
        .height40px, div:not(.container) .height40px { height: 40px !important; }
        .height30px, div:not(.container) .height30px { height: 30px !important; }
        .height25px, div:not(.container) .height25px { height: 25px !important; }
        .height20px, div:not(.container) .height20px { height: 20px !important; }
        .height15px, div:not(.container) .height15px { height: 15px !important; }
        .height10px, div:not(.container) .height10px { height: 10px !important; }
        .height6px, div:not(.container) .height6px { height: 6px !important; }
        /* ///// ADJUSTING PADDING ///// */
        .plr20, div:not(.container) .plr20 { padding-left: 20px !important; padding-right: 20px !important; }
        .plr15, div:not(.container) .plr15 { padding-left: 15px !important; padding-right: 15px !important; }
        .plr10, div:not(.container) .plr10 { padding-left: 10px !important; padding-right: 10px !important; }
        .plr0, div:not(.container) .plr0 { padding-left: 0px !important; padding-right: 0px !important; }
        .pt20, div:not(.container) .pt20 { padding-top: 20px !important; }
        .ptb20, div:not(.container) .ptb20 { padding-top: 20px !important; padding-bottom: 20px !important; }
        .ptb15, div:not(.container) .ptb15 { padding-top: 15px !important; padding-bottom: 15px !important; }
        .ptb10, div:not(.container) .ptb10 { padding-top: 10px !important; padding-bottom: 10px !important; }
        .pb20, div:not(.container) .pb20 { padding-bottom: 20px !important; }
        .pb15, div:not(.container) .pb15 { padding-bottom: 15px !important; }
        .pb10, div:not(.container) .pb10 { padding-bottom: 10px !important; }
        .p10, div:not(.container) .p10 { padding-top: 10px !important; padding-right: 10px !important; padding-bottom: 10px !important; padding-left: 10px !important; }
        .p0, div:not(.container) .p0 { padding-top: 0px !important; padding-right: 0px !important; padding-bottom: 0px !important; padding-left: 0px !important; }
        /* ///// BACKGROUNDS ///// */
        .bgColor, div:not(.container) .bgColor { background-color: #f7f7f7 !important; }
        .bgWhite, div:not(.container) .bgWhite { background-color: #ffffff !important; }
        .bgNone, div:not(.container) .bgNone { background-color: none !important; }
        /* ///// WIDTH 100 ///// */
        img.width100, div:not(.container) img.width100 { width: 100% !important; }
        table.width100, div:not(.container) table.width100 { width: 100% !important; }
        td.width100, div:not(.container) td.width100 { width: 100% !important; }
        /* ///// FONT SIZES ///// */
        .font11, div:not(.container) .font11 { font-size: 11px !important; }
        .font12, div:not(.container) .font12 { font-size: 12px !important; }
        .font15, div:not(.container) .font15 { font-size: 15px !important; }
        .font16, div:not(.container) .font16 { font-size: 16px !important; }
        .font22, div:not(.container) .font22 { font-size: 22px !important; }
        .font28, div:not(.container) .font28 { font-size: 28px !important; }
        .line120, div:not(.container) .line120 { line-height: 120% !important; }
        /* ///// IMAGE MANIPULATION ///// */
        div[class="pattern"] { position: relative; overflow: hidden; width: 105px; height: 227px; }
        div[class="pattern"] img { position: absolute; top: 0; left: 0; }
        div[class="pattern2"] { position: relative; overflow: hidden; width: 105px; height: 227px; }
        div[class="pattern2"] img { position: absolute; top: 0; right: 0; }
        .width88, div:not(.container) .width88 { width: 88px !important; }
        /* ///// FOOTER ///// */
        .social, div:not(.container) .social { width: 40px !important; }
        .socialw, div:not(.container) .socialw { width: 170px !important; }
        .divider, div:not(.container) .divider { padding: 0 0 20px 0 !important; border-bottom: 2px solid #f2f2f2 !important; }
        /* ///// MOBILE CONTENT ///// */
        *[class*="mobile-only"], div.mobile-only { display: block !important; max-height: none !important; }
        
        .tele a { text-decoration: none !important; color: #FFFFFF !important; }
        }
        img.width1001 { width: 100% !important; }
        td.width1001 { width: 100% !important; }
        </style>
        
        <!-- The following style block added to handle all the new modules added late 2017 -->
        <style type="text/css">
        @media only screen and (max-width:599px) {
        /* ///// ADJUSTING PADDING ///// */
        .pb30, div:not(.container) .pb30 { padding-bottom: 30px !important; }
        .pt0, div:not(.container) .pt0 { padding-top: 0 !important; }
        .pt5, div:not(.container) .pt5 { padding-top: 5px !important; }
        .pb0, div:not(.container) .pb0 { padding-bottom: 0 !important; }
        /* ///// FONT SIZES ///// */
        .font13, div:not(.container) .font13 { font-size: 13px !important; }
        /* ///// LOGO LOCKUP ///// */
        .logoLockUp, div:not(.container) .logoLockUp { max-width: 400px !important; float: none !important; }
        
        /* ///// VERTICAL ALIGNMENTS ///// */
        .valign-middle, div:not(.container) .valign-middle { vertical-align: middle !important; }
        /* ///// BLOCK HORIZONTAL ALIGNMENT ///// */
        .mob-center, div:not(.container) .mob-center { margin-left: auto !important; margin-right: auto !important; }
        /* ///// BACKGROUND IMAGE POSITIONS ///// */
        .cropLeft, div:not(.container) .cropLeft { background-position: top left !important; }
        .cropCenter, div:not(.container) .cropCenter { background-position: top center !important; }
        .cropRight, div:not(.container) .cropRight { background-position: top right !important; }
        /* ///// STATEMENTS: CUSTOM STYLES ///// */
        .statement .nlb, div:not(.container) .statement .nlb { border-left: 1px none #ffffff !important; }
        .statement .dividerTop, div:not(.container) .statement .dividerTop { border-top: 1px solid #b3b3b3 !important; }
        /* ///// RESPONSIVE BLOG ///// */
        .blogImageCol, div:not(.container) .blogImageCol { width: 37.5% !important; }
        .blogImageCol .blogPadding, div:not(.container) .blogImageCol .blogPadding { padding: 12.5% !important; }
        .blogTextCol, div:not(.container) .blogTextCol { width: 62.5% !important; }
        .blogImageLeft .blogTextCol .blogPadding, div:not(.container) .blogImageLeft .blogTextCol .blogPadding { padding-right: 7.5% !important; }
        .blogImageRight .blogTextCol .blogPadding, div:not(.container) .blogImageRight .blogTextCol .blogPadding { padding-left: 7.5% !important; }
        /* ///// ZEBRA STRIPE TABLES ///// */
        .zebra-odd, div:not(.container) .zebra-odd { background-color: #e5e5e5 !important; }
        .zebra-even, div:not(.container) .zebra-even { background-color: #ffffff !important; }
        /* ///// RESPONSIVE BACKGROUND IMAGES ///// */
        .imgRatio-6-5-padding { padding-top: 83.3333% !important; padding-left: 0 !important; }
        .imgRatio-6-5-height { height: 83.3333% !important; background-size: 100% !important; }
        /* ///// IMPROVING RENDERING FOR OLDER GMAIL ///// */
        .fullWidth { min-width: 100% !important; }
        }
        </style>
        
        <!-- STYLE BLOCK NOT USED FOR EMAILS -->
        <style>
        h1 { font-family: arial; font-size: 24px; line-height: 28px; padding-top: 15px; padding-bottom: 15px; padding-left: 10px; border-top: 1px solid #dedede; text-align: left; color: #000000; text-transform: uppercase; }
        h2 { font-family: arial; font-size: 14px; line-height: 17px; padding-top: 15px; padding-bottom: 15px; padding-left: 10px; border-top: 1px solid #dedede; text-align: left; color: #000000; text-transform: lowercase; }
        h2:after { content: ":"; }
        h2 span { font-weight: normal; font-style: italic; }
        h1, h2 { overflow-wrap: break-word; word-wrap: break-word; -ms-word-break: break-all; word-break: break-word; }
        </style>
        <!-- STYLE BLOCK NOT USED FOR EMAILS END -->
        
        </head>
        <body style="background-color:#f7f7f7;">
        <div style="display:none !important; visibility:hidden; mso-hide:all; font-size:1px; color:#ffffff; line-height:1px; max-height:0px; max-width:0px; opacity:0;overflow:hidden;"> Check in online</div>
        <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;">
        <tr>
        <td align="center">
        <table border="0" cellspacing="0" cellpadding="0" style="width:600px; min-width:600px; background-color:#ffffff;" class="width100 fullWidth">
        <tr>
        <td align="left"> 
        <!-- ///// MODULES START ///// --> 
        <!-- ///// DO NOT EDIT ANYTHING ABOVE THIS COMMENT ///// -->
        
        <!-- ///// MASTER-HEADER-NO-NAVIGATION-STACKED ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff">
        <tr>
        <td style="padding:25px;" class="plr15 ptb15">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td align="center"><a href="" target="_blank"><img src="https://res.cloudinary.com/duw4zfhmh/image/upload/v1680689164/at_mine/atminelogo_z31xgg.png" alt="atmine" width="145" style="vertical-align:top;" border="0"></a></td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        <!-- ///// MASTER-HEADER-NO-NAVIGATION-STACKED END ///// -->
        <!-- ///// PRIMARY ARTICLE CONTENT-CENTER ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td>
        <table border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff">
        <!-- ///// Image ///// -->
        <tr>
        <td style="text-align:center; vertical-align: middle;"><a href="{{mycheckExperienceUrl}}" target="_blank" style="text-decoration:none;"><img src="${property.images[0]}" width="400" alt="image_description" border="0" style="display:block; margin:0 auto;" class="width100 heightAuto"></a></td>
        </tr>
        <!-- ///// Image END ///// -->
        <tr>
        <td style="padding:20px;" class="plr0" bgcolor="#ffffff">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        <tr>
        <td style="line-height:18px;" class="plr15">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        
        <!-- ///// Text ///// -->
        <tr>
        <td align="justify" style="padding-bottom:15px; line-height:18px; font-size:15px; font-family:arial, helvetica, sans-serif; color:#444444;">Hello ${renter.username},<br><br>Thank you for booking ${property.title} from ${startDate} to ${endDate}.
        </td>
        </tr><table border="0" cellspacing="0" cellpadding="0" width="100%">
        </table>
        <!-- ///// Text END ///// -->
        
        <!-- Button Center -->
        <tr>
        <td align="center" style="padding:0 0 25px;">
        <table align="center" width="248" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate !important; border:1px solid #605cb8; border-radius:4px; overflow:hidden; width:248px; min-width:248px;" class="w100pc">
        <tr>
        <td bgcolor="#605cb8">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
        <td height="44" align="center" style="font-size:13px; height:44px; min-height:44px; line-height:20px; text-align:center; font-family: arial, helvetica, sans-serif; text-transform:uppercase;"><a title="B55" href="http://localhost:3000/bookings" target="_blank" style="color:#60c2a4; text-decoration:none; width:100%; display:block; padding:12px 0;"><span style="display:inline-block; color:#ffffff;">Manage your booking</span></a></td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- Button Center END --> 
        
        <!-- ///// Text ///// -->
        <tr>
        <td align="justify" style="padding-bottom:15px; line-height:18px; font-size:15px; font-family:arial, helvetica, sans-serif; color:#444444;">We look forward to seeing you soon!<br><br>The AtMine Team
        </td>
        </tr><table border="0" cellspacing="0" cellpadding="0" width="100%">
        </table>
        <!-- ///// Text END ///// -->

        
        
        </table>
        </td>
        </tr>
        </table>
        <!-- ///// PRIMARY ARTICLE CONTENT-CENTER END ///// -->
        <!-- ///// DOWNLOAD-APP-1COLUMN ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td bgcolor="#605cb8">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
        <td style="padding:20px;" class="plr15">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        <tr>
        <td style="line-height:18px;">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        <!-- ///// Title ///// -->
        <tr>
        <td align="center" style="padding-bottom:15px; line-height:100%; font-size:18px; font-family:arial, helvetica, sans-serif; color:#ffffff; text-transform:uppercase; font-weight:bold;">Download our free app</td>
        </tr>
        <!-- ///// Title END ///// -->
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr> 
        <!-- ///// App Store ///// -->
        <td align="right" style="padding:0 5px 0 0;"><a href="" target="_blank"><img src="http://www.cphz4assets.com/RadissonRewards/Static/EN_Download_on_the_App_Store_Badge.png" style="display:inline-block;" width="135" height="40" border="0" alt="App Store"></a></td>
        <!-- ///// App Store END ///// --> 
        <!-- ///// Google Play ///// -->
        <td align="left" style="padding:0 0 0 5px;"><a href="https://play.google.com/store/apps/details?id=com.radisson.hotels" target="_blank"><img src="http://www.cphz4assets.com/RadissonRewards/Static/en_google-play-badge.png
        " style="display:inline-block;" width="135" height="40" border="0" alt="Google Play"></a></td>
        <!-- ///// Google Play END ///// --> 
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- ///// 2px interspace ///// -->
        <tr style="line-height:2px;">
        <td height="2" width="100%" style="background-color:#f2f2f2; line-height:1px; font-size:1px;"></td>
        </tr>
        <!-- ///// 2px interspace END ///// -->
        
        </table>
        <!-- ///// DOWNLOAD-APP-1COLUMN END ///// -->
        <!-- ///// SOCIAL-1COLUMN ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td bgcolor="#605cb8">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
        <td style="padding:20px;" class="plr15">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        <tr>
        <td style="line-height:18px;">
        <table border="0" cellspacing="0" cellpadding="0" width="560" style="width:560px; min-width:560px;" class="width100 fullWidth">
        <!-- ///// Title ///// -->
        <tr>
        <td align="center" style="padding-bottom:15px; line-height:100%; font-size:18px; font-family:arial, helvetica, sans-serif; color:#ffffff; text-transform:uppercase; font-weight:bold;">Find us on</td>
        </tr>
        <!-- ///// Title END ///// -->
        <tr>
        <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="140" align="center" class="socialw">
        <tr> 
        <!-- ///// Facebook ///// -->
        <td align="center" style="padding:0 5px 0 0;"><a href="" style="display:inline-block;" width="36" border="0" alt="Facebook" class="social"></a></td>
        <!-- ///// Facebook END ///// --> 
        <!-- ///// Twitter ///// -->
        <td align="center" style="padding:0 5px 0 0;"><a href="" target="_blank"><img src="http://www.cphz4assets.com/RadissonRewards/Static/social-icon-twitter.png" style="display:inline-block;" width="36" border="0" alt="Twitter" class="social"></a></td>
        <!-- ///// Twitter END ///// --> 
        <!-- ///// YouTube ///// -->
        <td align="center" style="padding:0;"><a href="" target="_blank"><img src="http://www.cphz4assets.com/RadissonRewards/Static/social-icon-instagram.png" style="display:inline-block;" width="36" border="0" alt="YouTube" class="social"></a></td>
        <!-- ///// YouTube END ///// --> 
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- ///// 2px interspace ///// -->
        <tr style="line-height:2px;">
        <td height="2" width="100%" style="background-color:#f7f7f7; line-height:1px; font-size:1px;"></td>
        </tr>
        <!-- ///// 2px interspace END ///// -->
        </table>
        <!-- ///// SOCIAL-1COLUMN END ///// -->
        <!-- ///// MEMBER-LINKS ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td bgcolor="#605cb8">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
        <td style="padding:20px;" class="plr15">
        <table border="0" cellspacing="0" cellpadding="0" width="560" class="width100">
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <!-- ///// Title ///// -->
        <tr>
        <td align="center" style="padding-bottom:20px; line-height:130%; font-size:14px; font-family:arial, helvetica, sans-serif; color:#ffffff;"><!-- ///// Text ///// -->You've registered with us as:<br>
        <!-- ///// Text END ///// --><!-- ///// Email address ///// --><strong style="font-size:14px;"><a href="{{email}} " style="color:#ffffff; text-decoration:none;">${renter.email}</a></strong><!-- ///// Email address END ///// --></td>
        </tr>
        <!-- ///// Title END ///// -->
        
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <!-- ///// 10px interspace ///// -->
        <tr style="line-height:10px;">
        <td height="10" width="100%" style="background-color:#f7f7f7; line-height:1px; font-size:1px;"></td>
        </tr>
        <!-- ///// 10px interspace END ///// -->
        </table>
        <!-- ///// MEMBER-LINKS END ///// --><!-- ///// LOGO-LOCKUP ///// -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff">
        <tr>
        <td align="center" style="padding:25px 20px;" class="ptb15">
        <!-- FOR LARGER SCREENS -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="h">
        <tr>
        <td style="padding-top:3px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
        <td align="center">
        
        <!-- ///// Text ///// -->
        <tr>
        <td align="left" style="padding-bottom:15px; line-height:16px; font-size:11px; font-family:arial, helvetica, sans-serif; color:#7d7d7d;"> This is a post only email. Please do not reply.<br><br><a href="https://res.cloudinary.com/duw4zfhmh/image/upload/v1680689164/at_mine/atminelogo_z31xgg.png">Privacy Policy</a><br><br>This email is deployed by Guille and Jorge on behalf of Atmine.<br><br>The information contained in this e-mail is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged material. If you are not the intended recipient of this e-mail, the use of this information or any disclosure, copying, or distribution is prohibited and may be unlawful. Email transmission cannot be guaranteed to be secure or error-free. Therefore, we do not represent that this information is complete or accurate and it should not be relied upon as such. If you received this in error, please contact the sender and delete the material from any computer.<br><br>© Atmine. All rights reserved. The Atmine logo and name are trademarks of Atmine.</td>
        </tr>
        <!-- ///// Text END ///// -->
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        <!-- ///// GM-FOOTER END ///// -->
        <!-- ///// MODULES END ///// --> 
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>`
      ,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

module.exports = router;