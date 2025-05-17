const supabase = require('../config/supabaseClient');

const getQueryHistory = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('query_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const saveQueryToHistory = async ({ question, sql, result_summary }) => {
  await supabase.from('query_logs').insert([{ question, sql, result_summary }]);
};

const deleteQueryFromHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('query_logs').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQueryHistory,
  saveQueryToHistory,
  deleteQueryFromHistory,
};
