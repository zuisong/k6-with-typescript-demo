import http from 'k6/http';

const d : string = ""
export default function () {
  http.get('http://test.k6.io');
}
