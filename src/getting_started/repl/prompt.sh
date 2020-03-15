===========================================================
                 _                    ____   ___  _
 _   _ _ __ ___ | |__   ___  _ __ ___/ ___| / _ \| |
| | | | '__/ _ \| '_ \ / _ \| '__/ _ \___ \| | | | |
| |_| | | | (_) | |_) | (_) | | | (_) |__) | |_| | |___
 \__,_|_|  \___/|_.__/ \___/|_|  \___/____/ \__\_\_____|

uroboroSQL SQL REPL ver.0.18.1
===========================================================

Commands :
        query   : execute query from loaded sql file.
                ex1) query [sql file name]<Enter> : Execute SQL without parameter.
                ex2) query [sql file name] param1=val1 param2=val2 ...<Enter> : Execute SQL with the specified parameters.
        update  : execute update from loaded sql file.
                ex1) update [sql file name]<Enter> : Execute SQL without parameter.
                ex2) update [sql file name] param1=val1 param2=val2 ...<Enter> : Execute SQL with the specified parameters.
        view    : view sql file.
                ex) view [sql file name]<Enter> : Show sql file contents.
        list    : list loaded sql files.
                ex1) list<Enter> : Show all loaded sql file(s).
                ex2) list keyword<Enter> : Show loaded sql file(s) filter by keyword.
        history : list command history.
                ex1) history<Enter> : Show all command history.
                ex2) history keyword<Enter> : Show command history filter by keyword.
        driver  : list loaded drivers.
        desc    : describe table.
                ex) desc [table name]<Enter> : Show table description.
        generate: generate sql to access the table.
                ex) generate [select/insert/update/delete] [table name]<Enter> : Show sql to access tables according to keywords.
        parse   : parse sql file.
                ex) parse [sql file name]<Enter> : Parse sql file.
        cls     : clear screen.
        exit    : exit SQL REPL. `CTRL+C` is an alias.
Properties file path:REPL\repl.properties
[Properties]
db.password=
sql.additionalClassPath=src/test/resources;target/test-classes;${user.home}/.m2/repository/com/h2database/h2/1.4.199/h2-1.4.199.jar
sql.encoding=UTF-8
db.user=sa
sql.versionColumnName=lock_no
sql.optimisticLockSupplier=jp.co.future.uroborosql.mapping.FieldIncrementOptimisticLockSupplier
db.url=jdbc:h2:mem:repldb;DB_CLOSE_DELAY=-1;
sqlContextFactory.enumConstantPackageNames=jp.co.future.uroborosql.context.test
sqlContextFactory.constantClassNames=jp.co.future.uroborosql.context.test.TestConsts
initialize.

uroborosql >