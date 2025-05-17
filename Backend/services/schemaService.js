const supabase = require('../config/supabaseClient');

const getSchemaMetadata = async () => {
    console.log(" inside schemaService");

  const sql = `
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `;
  const { data, error } = await supabase.rpc('execute_raw_sql', { sql });
  if (error) throw error;
  return data;
};

const getSampleFromTable = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(5);
  if (error) throw error;
              console.log(" exiing schemaService");

  return data;
};

module.exports = { getSchemaMetadata, getSampleFromTable };
