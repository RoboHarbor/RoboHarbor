// types
import { Layout, PricingPlan, Statistic, Testimonial, Service } from './types';

// images
import image1 from '../../assets/images/landing/icons/layers.png';
import image2 from '../../assets/images/landing/icons/core.png';
import image3 from '../../assets/images/landing/icons/paperdesk.png';
import image4 from '../../assets/images/landing/icons/solarsystem.png';
import image5 from '../../assets/images/landing/icons/datatext.png';
import image6 from '../../assets/images/landing/icons/browserscript.png';

import layout1 from '../../assets/images/landing/demo/demo-1.jpg';
import layout2 from '../../assets/images/landing/demo/demo-2.jpg';
import layout3 from '../../assets/images/landing/demo/demo-3.jpg';
import layout4 from '../../assets/images/landing/demo/demo-4.jpg';
import layout5 from '../../assets/images/landing/demo/demo-5.jpg';
import layout6 from '../../assets/images/landing/demo/demo-6.jpg';

import testi1 from '../../assets/images/landing/testi/img-1.png';
import testi2 from '../../assets/images/landing/testi/img-2.png';
import testi3 from '../../assets/images/landing/testi/img-3.png';

const layouts: Layout[] = [
    {
        image: layout1,
        name: 'Light Layouts',
        link: '#',
    },
    {
        image: layout2,
        name: 'Horizontal Layouts',
        link: '#',
    },
    {
        image: layout3,
        name: 'Semi Dark Layout',
        link: '#',
    },
    {
        image: layout4,
        name: 'Semi Dark Horizontal',
        link: '#',
    },
    {
        image: layout5,
        name: 'Landing Page',
        link: '#',
    },
    {
        image: layout6,
        name: 'Dark Sidebar',
        link: '#',
    },
];

const testimonials: Testimonial[] = [
    {
        id: 1,
        clientName: 'Xpanta',
        title: 'Adminto User',
        avatar: testi1,
        message:
            ' The designer of this theme delivered a quality product. I am not a front-end developer and I hate when the theme I download has glitches or needs minor tweaks here and there. This worked for my needs just out of the boxes. Also, it is fast and elegant.',
    },
    {
        id: 2,
        clientName: 'G_Sam',
        title: 'Adminto User',
        avatar: testi2,
        message:
            ' Extremely well designed and the documentation is very well done. Super happy with the purchase and definitely recommend this! ',
    },
    {
        id: 3,
        clientName: 'Isaacfab',
        title: 'Adminto User',
        avatar: testi3,
        message:
            " We used this theme to save some design time but... wow it has everything you didn't realize you would need later.I highly recommend this template to get your web design headed in the right direction quickly. ",
    },
];

const statistics: Statistic[] = [
    {
        icon: 'pe-7s-add-user',
        title: 'Fans',
        value: 1200,
    },
    {
        icon: 'pe-7s-cart',
        title: 'Total Sales',
        value: 1500,
        counterOptions: {
            suffix: ' +',
        },
    },
    {
        icon: 'pe-7s-smile',
        title: 'Happy Clients',
        value: 6931,
    },
    {
        icon: 'pe-7s-medal',
        title: 'Won Prices',
        value: 800,
    },
];

const pricingPlans: PricingPlan[] = [
    {
        id: 1,
        name: 'Single',
        price: 24,
        duration: 'license',
        features: ['Number of end products 1', 'Customer support', 'Free Updates', 'Monthly updates', '24 x 7 Support'],
    },
    {
        id: 1,
        name: 'Multiple',
        price: 120,
        duration: 'license',
        features: ['Number of end products 1', 'Customer support', 'Free Updates', 'Monthly updates', '24 x 7 Support'],
    },
    {
        id: 2,
        name: 'Extended',
        price: 999,
        duration: 'license',
        features: ['Number of end products 1', 'Customer support', 'Free Updates', 'Monthly updates', '24 x 7 Support'],
    },
];

const services: Service[] = [
    {
        image: image1,
        title: 'Responsive Layouts',
        shortDesc: 'The new common language will be more simple and regular than the existing European languages.',
    },
    {
        image: image2,
        title: 'Based on Bootstrap UI',
        shortDesc: 'If several languages coalesce the grammar language is more than that of indual languages.',
    },
    {
        image: image3,
        title: 'Creative Design',
        shortDesc:
            'It will be as simple as occidental it will be to an english person. It will be as simple as occidental',
    },
    {
        image: image4,
        title: 'Awesome Support',
        shortDesc: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut',
    },
    {
        image: image5,
        title: 'Easy to customize',
        shortDesc: 'Everyone realizes why a new common language would be one could refuse to pay translators.',
    },
    {
        image: image6,
        title: 'Quality Code',
        shortDesc: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis deleniti atque',
    },
];

export { layouts, pricingPlans, statistics, testimonials, services };
