Maven versioning is similar to SemVer but also very different in places.
It's specified by Maven itself.

Ranges are supported using Maven's special syntax.

For development purposes, download [maven-artifact JAR](https://repo1.maven.org/maven2/org/apache/maven/maven-artifact/3.9.8/maven-artifact-3.9.8.jar) and run:

```sh
$ java -jar maven-artifact-3.9.8.jar 3.2.4-alpha-1 3.2.4-SNAPSHOT 3.2.4.0
Display parameters as parsed by Maven (in canonical form) and comparison result:
1. 3.2.4-alpha-1 == 3.2.4.alpha.1
   3.2.4-alpha-1 < 3.2.4-SNAPSHOT
2. 3.2.4-SNAPSHOT == 3.2.4.snapshot
   3.2.4-SNAPSHOT < 3.2.4.0
3. 3.2.4.0 == 3.2.4
```
