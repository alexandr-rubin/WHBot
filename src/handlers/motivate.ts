import Context from '../models/Context'

export default async function sendVideo(ctx: Context) {
  const photoUrl =
    'https://rr4---sn-4g5ednsr.googlevideo.com/videoplayback?expire=1688872247&ei=19CpZLmZH6SN6dsPxdq9CA&ip=2001%3A67c%3A2660%3A425%3A3617%3Aebff%3Afee4%3A6450&id=o-AK37kjAJHMz-AsaVO5XmFoIMJeae6xAzNk-2_N_O-jeB&itag=18&source=youtube&requiressl=yes&mh=Bl&mm=31%2C29&mn=sn-4g5ednsr%2Csn-4g5lznez&ms=au%2Crdu&mv=m&mvi=4&pl=48&initcwndbps=821250&siu=1&bui=AYlvQAu6ErQtU4Q5zs1eVWazo1P2Q2X8aZA2mDuO-cciosD6awXCo0J8Hc-n2gX2_E_lTfbr9b2ym5guLcWj3uDNdg&spc=Ul2Sq_rrHck9jS19IHu0MXYkjZxIk8DQvmIjD_SYnHcxSR04wdqdO2g&vprv=1&svpuc=1&mime=video%2Fmp4&ns=4CvFRm1_FCKIfUuH5K3vruIO&gir=yes&clen=4951714&ratebypass=yes&dur=149.443&lmt=1672306487930689&mt=1688850308&fvip=1&fexp=24007246%2C51000023&c=WEB&txp=5319224&n=2dLoMUvXLZY2NA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Csiu%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhANWVSgase_SL3F67vwKmDkMiZ7C2hyEd9XmOlOS8r9xWAiEA5ahObG6TVCCuskh_Cb3EGdgjcrdNsDy4vU7aDKEhTJY%3D&sig=AOq0QJ8wRAIgdwe8bC28IhP39mkIPFZ6TOhdN3vUEpJVafGn6uLkTekCIA395uhpqyex2lPkWTl1AjDaRrnTJIywYhoLGtX9M1kg'
  return await ctx.replyWithVideoNote(photoUrl)
}
