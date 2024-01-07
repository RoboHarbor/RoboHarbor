// types
import { ProjectsList } from './types';

// images
import user1 from '../../assets/images/users/user-1.jpg';
import user2 from '../../assets/images/users/user-2.jpg';
import user3 from '../../assets/images/users/user-3.jpg';
import user4 from '../../assets/images/users/user-4.jpg';
import user5 from '../../assets/images/users/user-5.jpg';
import user6 from '../../assets/images/users/user-6.jpg';
import user7 from '../../assets/images/users/user-7.jpg';
import user8 from '../../assets/images/users/user-8.jpg';
import user9 from '../../assets/images/users/user-9.jpg';
import user10 from '../../assets/images/users/user-10.jpg';

export const projects: ProjectsList[] = [
    {
        id: 1,
        title: 'New Admin Design',
        category: 'WEB DESIGN',
        state: 'Completed',
        shortDesc:
            'If several languages coalesce the grammar is more simple and regular than that of the individual languages...',
        question: 56,
        comment: 452,
        teamMembers: [
            {
                image: user1,
                name: 'Mat Helme',
            },
            {
                image: user2,
                name: 'Michael Zenaty',
            },
            {
                image: user3,
                name: 'James Anderson',
            },
            {
                image: user4,
                name: 'Mat Helme',
            },
            {
                image: user5,
                name: 'Username',
            },
        ],
        progress: 80,
        variant: 'success',
    },
    {
        id: 2,
        title: 'App Design and Develop',
        category: 'ANDROID',
        state: 'Completed',
        shortDesc: 'New common language will be more simple and regular than the existing European languages...',
        question: 77,
        comment: 875,
        teamMembers: [
            {
                image: user6,
                name: 'Mat Helme',
            },
            {
                image: user7,
                name: 'Michael Zenaty',
            },
            {
                image: user8,
                name: 'James Anderson',
            },
        ],
        progress: 45,
        variant: 'primary',
    },
    {
        id: 3,
        title: 'Landing page Design',
        category: 'WEB DESIGN',
        state: 'Completed',
        shortDesc:
            'It will be as simple as occidental in fact it will be to an english person it will seem like simplified English...',
        question: 87,
        comment: 125,
        teamMembers: [
            {
                image: user9,
                name: 'Mat Helme',
            },
            {
                image: user10,
                name: 'Michael Zenaty',
            },
            {
                image: user1,
                name: 'James Anderson',
            },
            {
                image: user3,
                name: 'Mat Helme',
            },
        ],
        progress: 68,
        variant: 'pink',
    },
    {
        id: 4,
        title: 'App Design and Develop',
        category: 'ANDROID',
        state: 'Completed',
        shortDesc:
            'Everyone realizes why a new common language would be desirable one could refuse to pay expensive translators...',
        question: 77,
        comment: 875,
        teamMembers: [
            {
                image: user5,
                name: 'Mat Helme',
            },
            {
                image: user8,
                name: 'Michael Zenaty',
            },
            {
                image: user9,
                name: 'James Anderson',
            },
        ],
        progress: 45,
        variant: 'purple',
    },
    {
        id: 5,
        title: 'Landing page Design',
        category: 'WEB DESIGN',
        state: 'Completed',
        shortDesc: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium deleniti...',
        question: 87,
        comment: 125,
        teamMembers: [
            {
                image: user3,
                name: 'Mat Helme',
            },
            {
                image: user4,
                name: 'Michael Zenaty',
            },
            {
                image: user5,
                name: 'James Anderson',
            },
            {
                image: user1,
                name: 'Mat Helme',
            },
        ],
        progress: 68,
        variant: 'danger',
    },
    {
        id: 6,
        title: 'New Admin Design',
        category: 'WEB DESIGN',
        state: 'Completed',
        shortDesc:
            'Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary....',
        question: 56,
        comment: 452,
        teamMembers: [
            {
                image: user6,
                name: 'Mat Helme',
            },
            {
                image: user7,
                name: 'Michael Zenaty',
            },
            {
                image: user8,
                name: 'James Anderson',
            },
        ],
        progress: 80,
        variant: 'warning',
    },
];
