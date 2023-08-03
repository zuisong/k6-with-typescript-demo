import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

export const requests = new Counter('http_reqs');
const myFailRate = new Rate('failed requests');

export const options = {
    scenarios: {
        main: {  //Test Case 1
            executor: 'constant-vus',
            exec: 'main',
            vus: 30,
            duration: '90s',
        },
        login: {   //Test Case 2
            executor: 'constant-vus',
            exec: 'login',
            vus: 10,
            startTime: '15s',
            duration: '90s',
        },
        about: {   //Test Case 3
            executor: 'shared-iterations',
            exec: 'about',
            vus: 5,
            iterations: 50,
            startTime: '30s',
            maxDuration: '90s',
        },
    }
}

export function main() { //Test Case 1
    const res = http.get<"text">('http://localhost:3000/#/');
    sleep(Math.random() * 5);
    myFailRate.add(res.status !== 200);
    const checkRes = check(res, {
        'status was 200': (r) => r.status == 200,
        'response body contains <OWASP Juice Shop>': (r) => r.body.indexOf('OWASP Juice Shop') !== -1,
        'duration was <=200ms(miliseconds)': (r) => r.timings.duration <= 200,
    });
}

export function login() { //Test Case 2
    const res = http.get<'text'>('http://localhost:3000/#/login');
    sleep(Math.random() * 2);
    myFailRate.add(res.status !== 200);
    const checkRes = check(res, {
        'status was 200': (r) => r.status == 200,
        'response body contains <Login1>': (r) => r.body.includes("Login"),  //Failure expected here. Not found, Yet I see it on the page
        'response body contains <Login2>': (r) => r.body.includes('Login'),  //Failure expected here. Not found, Yet I see it on the page
        'response body contains <Login3>': (r) => r.body.indexOf('Login') !== -1,  //Failure expected here. Not found, Yet I see it on the page
        'response body contains <Login4>': (r) => r.body.indexOf("Login") !== -1,  //Failure expected here. Not found, Yet I see it on the page
        'response body contains <OWASP Juice Shop> in the Login page': (r) => r.body.indexOf('OWASP Juice Shop') !== -1,
        'duration was <=200ms(Login)': (r) => r.timings.duration <= 200,
    });
}

export function about() { //Test Case 3
    const res = http.get<'text'>('http://localhost:3000/#/about')
    sleep(Math.random() * 5);
    myFailRate.add(res.status !== 200);
    const checkRes = check(res, {
        'status was 200': (r) => r.status == 200,
        'response body contains <About Us>': (r) => r.body.includes('About Us'), //Failure expected here. Not found, Yet I see it on the page
        'response body contains <OWASP Juice Shop> in the About page': (r) => r.body.indexOf('OWASP Juice Shop') !== -1,
        'duration was <=200ms(About)': (r) => r.timings.duration <= 200,
    });
}