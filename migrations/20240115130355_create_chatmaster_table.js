exports.up = function (knex) {
    return knex.schema.createTable('chatmaster', function (table) {
      table.increments('id').primary();
      table.mediumtext('chatmaster_id');
      table.varchar('sender_id', 1000);
      table.varchar('receiver_id', 1000);
      table.varchar('sender_income', 1000);
      table.varchar('receiver_income', 1000);
      table.datetime('updated_at').defaultTo(knex.fn.now());
      table.datetime('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('chatmaster');
  };
  