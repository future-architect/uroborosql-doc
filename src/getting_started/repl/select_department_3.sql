uroborosql > query department/select_department deptNo=1 deptName=sales
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptNo)], Result:[true], Parameter:[deptNo:[1]]
[DEBUG] Evaluation Expression:[SF.isNotEmpty(deptName)], Result:[true], Parameter:[deptName:[{115,97,108,101,115},0,0]]
[DEBUG] Executed SQL[
select /* department/select_department */
        dept.dept_no            as      dept_no
,       dept.dept_name          as      dept_name
,       dept.lock_version       as      lock_version
from
        department      dept
where
dept.dept_no    =       ?/*deptNo*/
and     dept.dept_name  =       ?/*deptName*/

]
[DEBUG] Set the parameter.[INDEX[1], Parameter name[deptNo], Value[1], Class[Integer]]
[DEBUG] Set the parameter.[INDEX[2], Parameter name[deptName], Value[sales], Class[String]]
[DEBUG] Execute search SQL.
[INFO ]
+-------+---------+------------+
|DEPT_NO|DEPT_NAME|LOCK_VERSION|
+-------+---------+------------+
|      1|sales    |           0|
+-------+---------+------------+
[DEBUG] SQL execution time [department/select_department] : [00:00:00.006]
query sql[department/select_department] end.
uroborosql >