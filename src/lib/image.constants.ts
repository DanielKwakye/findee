const ImageOrigin = `https://res.cloudinary.com/ddnzrzwjx/image/upload/f_auto,q_auto`;
const renderImageV2 = (fileName: string) =>
    `https://ik.imagekit.io/aepn9zqke/findmus${fileName}?tr=w-800,f-auto,q-auto`;
export const ImageConstants = {
    KeysFound: renderImageV2('/item-found.png'),
    FindmusIcon: 'https://findmus.com/_next/image?url=%2Fimages%2Fpng%2Fapp-icon.png&w=96&q=75',
    FindmusLogoOnDark: '/images/png/logo-on-dark.png',
    FindmusLogoOnLight: '/images/png/logo-on-light-white-bg.png',
    FindmusLogoEverywhere: '/images/png/logo-anywhere.png',
    FindeeOnLaptop: `${ImageOrigin}/v1790231037/findee-on-laptop_eva3y5.png`,
    FindeeOnKeyHolder: `${ImageOrigin}/v1790231354/findee-on-key-holder_qz3ogk.png`,
    FindeeOnWallet: `${ImageOrigin}/v1790302433/findee-on-wallet_j29ufq.png`,
    FindeeOnPhone: `${ImageOrigin}/v1790245044/findee-on-phone_joqd2b.png`,
    FindeeOnLaptop2: `${ImageOrigin}/v1791855785/Laptop_Return_Sticker_Product_Render_h3f1ce.png`,
    ScanQRCode: `${ImageOrigin}/v1791855785/Hand_Scanning_Findmus_QR_Sticker_wgudkp.png`,
    NotifyItemFound: `${ImageOrigin}/v1791855785/iPhone_Lock_Screen_Notifications_Mockup_bcpjmt.png`,

//     Everyday
    Bottle: renderImageV2('/everyday/watter%20bottle.png'),
    Wallet: renderImageV2('/everyday/wallet.png'),
    Keys: renderImageV2('/everyday/keys.png'),
    Laptop: renderImageV2('/everyday/laptop.png'),
    Cards: renderImageV2('/everyday/cards.png'),

//     Fabric
    FindeeOnBag: renderImageV2('/fabric/QR%20Tag%20on%20Backpack%20Strap.png'),
    Scarves: renderImageV2('/fabric/scarves.png'),
    Hats: renderImageV2('/fabric/hats.png'),
    Backpack: renderImageV2('/fabric/Backpack.png'),
    Uniforms: renderImageV2('/fabric/uniforms.png'),
    Jackets: renderImageV2('/fabric/Jackets.png'),
    Shoes: renderImageV2('/fabric/shoes.png'),

//     Tough
    Bikes: renderImageV2('/tough/bike.png'),
    SuitCase: renderImageV2('/tough/Suitcase.png'),
    Helmets: renderImageV2('/tough/helmet.png'),
};
