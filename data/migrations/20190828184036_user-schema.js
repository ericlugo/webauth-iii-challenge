exports.up = function(knex) {
  return knex.schema.createTable(`user`, (tbl) => {
    tbl.increments(`user_id`);
    tbl.string(`username`, 128).notNullable();
    tbl.string(`password`, 128).notNullable();
    tbl.string(`department`, 128).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user');
};
