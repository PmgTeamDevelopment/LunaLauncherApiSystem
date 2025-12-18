import fs from "fs";
import path from "path";

export default function Page() {
  const htmlPath = path.join(process.cwd(), "public/hub/index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  return (
    <html>
      <head />
      <body dangerouslySetInnerHTML={{ __html: html }} />
    </html>
  );
}
