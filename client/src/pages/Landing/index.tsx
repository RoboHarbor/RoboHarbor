import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// components
import NavBar from './NavBar';
import Hero from './Hero';
import Feature from './Feature';
import Demos from './Demos';
import Clients from './Clients';
import Statistics from './Statistics';
import Pricing from './Pricing';
import Contact from './Contact';
import Footer from './Footer';
import Services from './Services';

// dummy data
import { layouts, pricingPlans, statistics, testimonials, services } from './data';

const Landing = () => {
    useEffect(() => {
        document.querySelector('body')?.classList.add('bg-white', 'pb-0');

        // manage go to top button
        let mybutton = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                mybutton!.style.display = 'block';
            } else {
                mybutton!.style.display = 'none';
            }
        });

        return () => {
            document.querySelector('body')?.classList.remove('bg-white', 'pb-0');
        };
    }, []);

    // reach to top of web page
    const topFunction = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <div className="landing">
            {/* navbar */}
            <NavBar />

            {/* home */}
            <Hero />

            {/* feature */}
            <Feature />

            {/* demos */}
            <Demos layouts={layouts} />

            {/* clients */}
            <Clients testimonials={testimonials} />
            {/* services */}
            <Services services={services} />

            {/* statistics */}
            <Statistics statistics={statistics} />

            {/* pricing */}
            <Pricing pricingPlans={pricingPlans} />

            {/* contact */}
            <Contact />

            {/* footer */}
            <Footer />

            <Link to="#" onClick={() => topFunction()} className="back-to-top" id="back-to-top">
                <i className="mdi mdi-chevron-up"></i>
            </Link>
        </div>
    );
};

export default Landing;
