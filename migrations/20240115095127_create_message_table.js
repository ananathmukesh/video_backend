/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('message', function (table) {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.integer('sender_id').notNullable();
        table.integer('receiver_id').notNullable();
        table.string('type', 300).notNullable();
        table.longtext('message').notNullable();
        table.longtext('img').notNullable();
        table.integer('unread').notNullable();
        table.string('time', 1000).notNullable();
        table.string('incoming', 50).notNullable();
        table.string('outgoing', 50).notNullable();
        table.string('subtype', 100).notNullable();
        table.longtext('chatmaster_id').notNullable();
        table.string('reply', 100).notNullable();
        table.string('blob_url', 'varchar(MAX)').notNullable();
        table.string('reaction', 300).notNullable();
        table.string('reaction', 'datetime').notNullable();
        table.string('star', 100).notNullable();
        table.string('incoming1', 100).notNullable();
        table.string('outgoing1', 100).notNullable();
        table.string('edited', 100).notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('message');
};
