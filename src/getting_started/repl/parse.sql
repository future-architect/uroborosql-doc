uroborosql > parse department/select_department
PARSE:

SQL :
select /* _SQL_ID_ */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
/*BEGIN*/
where
/*IF SF.isNotEmpty(deptNo)*/
and     dept.dept_no    =       /*deptNo*/1
/*END*/
/*IF SF.isNotEmpty(deptName)*/
and     dept.dept_name  =       /*deptName*/'sample'
/*END*/
/*END*/

BRANCHES :
        BEGIN {
                IF ( SF.isNotEmpty(deptNo) ) {
                }
                IF ( SF.isNotEmpty(deptName) ) {
                }
        }

BIND_PARAMS :
        deptName
        deptNo
uroborosql >