import { ImageConstants } from '@/lib/image.constants';

export const heroCarouselItems = [
    {
        image: ImageConstants.FindeeOnLaptop,
        titleKey: 'laptopsTitle',
        descriptionKey: 'laptopsDescription',
        altKey: 'laptopsAlt',
    },
    {
        image: ImageConstants.Cards,
        titleKey: 'passesTitle',
        descriptionKey: 'passesDescription',
        altKey: 'passesAlt',
    },
    {
        image: ImageConstants.FindeeOnKeyHolder,
        titleKey: 'keysTitle',
        descriptionKey: 'keysDescription',
        altKey: 'keysAlt',
    },
    {
        image: ImageConstants.KeysFound,
        titleKey: 'keysFoundTitle',
        descriptionKey: 'keysFoundDescription',
        altKey: 'keysFoundAlt',
    },
    {
        image: ImageConstants.FindeeOnWallet,
        titleKey: 'walletsTitle',
        descriptionKey: 'walletsDescription',
        altKey: 'walletsAlt',
    },
    {
        image: ImageConstants.FindeeOnPhone,
        titleKey: 'phonesTitle',
        descriptionKey: 'phonesDescription',
        altKey: 'phonesAlt',
    },
    {
        image: ImageConstants.FindeeOnBag,
        titleKey: 'bagsTitle',
        descriptionKey: 'bagsDescription',
        altKey: 'bagsAlt',
    },
] as const;
