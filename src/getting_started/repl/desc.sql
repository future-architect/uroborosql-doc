uroborosql > desc EMPLOYEE
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|TABLE_NAME|COLUMN_NAME |TYPE_NAME|COLUMN_SIZE|DECIMAL_DIGITS|IS_NULLABLE|COLUMN_DEF                                                                      |REMARKS                        |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|EMPLOYEE  |EMP_NO      |DECIMAL  |          6|             0|NO         |(NEXT VALUE FOR "PUBLIC"."SYSTEM_SEQUENCE_D06A5524_EC18_4835_A536_1F5A372BFC73")|emp_no                         |
|EMPLOYEE  |FIRST_NAME  |VARCHAR  |         20|             0|NO         |                                                                                |first_name                     |
|EMPLOYEE  |LAST_NAME   |VARCHAR  |         20|             0|NO         |                                                                                |last_name                      |
|EMPLOYEE  |BIRTH_DATE  |DATE     |         10|             0|NO         |                                                                                |birth_date                     |
|EMPLOYEE  |GENDER      |CHAR     |          1|             0|NO         |                                                                                |gender        'F'emale/'M'ale/'O'ther|
|EMPLOYEE  |LOCK_VERSION|DECIMAL  |         10|             0|NO         |                                                                               0|lock_version                   |
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
uroborosql >