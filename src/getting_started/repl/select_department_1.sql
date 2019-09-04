uroborosql > query department/select_department
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptNo)], Result:[false], Parameter:[deptNo:[null]]
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptName)], Result:[false], Parameter:[deptName:[null]]
[DEBUG] Executed SQL[
select /* department/select_department */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept

]
[DEBUG] Execute search SQL.
[INFO ]
+-------+----------+------------+
|DEPT_NO|DEPT_NAME |LOCK_VERSION|
+-------+----------+------------+
|      1|sales     |           0|
|      2|export    |           0|
|      3|accounting|           0|
|      4|personnel |           0|
+-------+----------+------------+
[DEBUG] SQL execution time [department/select_department] : [00:00:00.078]
query sql[department/select_department] end.
uroborosql >