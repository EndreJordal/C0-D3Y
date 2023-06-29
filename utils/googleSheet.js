import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const googleSheet = async config => {
    const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"],
      });
    
      const sheets        = google.sheets({ version: "v4", auth });
      const drive         = google.drive({ version: "v3", auth });
      const range         = `${config.sheetName}!${config.range}`;
      const spreadsheetId = process.env.SHEET_ID;

      const { resource, valueInputOption } = config

      if (config.note) {
        await drive.comments.create({
          fileId: spreadsheetId,
          resource: {content: resource},
          fields: 'id,content'
        })
        return;
      }
      
    
      const content = await sheets.spreadsheets.values[config.write ? "append" : "get"]({
        spreadsheetId   ,
        range           ,
        resource        ,
        valueInputOption,
      })
      return content.data.values
}
export { googleSheet }