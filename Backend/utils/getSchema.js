const supabase = require('../config/supabaseClient');

const getSchemaDescription = async () => {
  console.log(" inside getSchema");
  
  const { data, error } = await supabase.rpc('get_schema');
  if (error) throw error;

  const grouped = {};
  data.forEach(({ table_name, column_name, data_type }) => {
    if (!grouped[table_name]) grouped[table_name] = [];
    grouped[table_name].push(`${column_name} (${data_type})`);
  });

  console.log(" exiting getSchema");

  const result = Object.entries(grouped)
    .map(([table, columns]) => `Table: ${table}\nColumns: ${columns.join(', ')}`)
    .join('\n\n');

  console.log(result);
  return result;
};

module.exports = { getSchemaDescription };
