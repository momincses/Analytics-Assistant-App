const supabase = require("../config/supabaseClient");

const cleanSQL = (sql) => {
  return sql
    .replace(/```sql/g, '')   // remove code block start
    .replace(/```/g, '')      // remove code block end
    .replace(/\/n/g, '')      // remove "/n"
    .replace(/\[object Object\]/g, '') // remove accidental objects
    .trim()
    .replace(/;+$/, '');
};

const executeQuery = async (sql) => {
  console.log("inside sqlService");
  console.log("sql before : ", sql);

  const cleanedSQL = cleanSQL(sql);
  console.log("Cleaned SQL:", cleanedSQL, "end here");  // for debugging

  const { data, error } = await supabase.rpc("execute_raw_sql", { sql: cleanedSQL });

  if (error) throw error;

  console.log("exiting sqlService");

  return data;
};

module.exports = { executeQuery };
