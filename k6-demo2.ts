import { check } from "k6";
import { parseHTML } from "k6/html";
import http from "k6/http";

export default function () {
  const res = http.get<"text">("https://k6.io");
  const doc = parseHTML(res.body); // equivalent to res.html()
  const pageTitle = check(doc, {
    "title is not null": (doc) => doc.find("head title").text() != null,
    "langAttr is not null": (doc) => doc.find("html").attr("lang") == null,
  });
}
