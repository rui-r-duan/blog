---
layout: post
title: "Total Order and Java Comparable"
date: 2017-11-28 00:09:00 -0500
categories: java
---

## Problem

### Comparable.compareTo() specification

We know that we can implement `java.lang.Comparable` interface to make a class comparable by the `sort()` methods in `Collections` or `Arrays` classes.  

According to the API specification of `Comparable.compareTo(that)`, it returns a negative integer when `this` is smaller than `that`, or a positive integer when `this` is bigger than `that`, or zero when `this` is equal to `that`.

### Comparing floating-point numbers with epsilon

As we know, floating-point math is not exact.  If you compare the following floating-point numbers using `==` like this:
{% highlight java %}
if (result == expectedResult)
{% endhighlight %}
then it is unlikely that the comparison will be true.  If the comparison is true then it is probably unstable.  See [Comparing Floating Point Numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/) for a thourough discussion.

Thus we usualy see some code, especially the code written in C langauge, using comparing with epsilon, like this:
{% highlight java %}
if (fabs(result - expectedResult) < 0.00001)
{% endhighlight %}
If the two floating-numbers are **close enough**, they can be treated to be **equal**.

### Can you find the bug?

Now Look at the following code, it is compliant with the specification in terms of the return value.  But there is a bug.  Can you find it?

{% highlight java %}
public class Temperature implements Comparable<Temperature> {
    private final double degrees;
    
    public Temperature(double degrees) {
        if (Double.isNaN(degrees))
            throw new IllegalArgumentException();
        this.degrees = degrees;
    }

    public int compareTo(Temperature that) {
        double EPSILON = 0.1;
        if (this.degrees < that.degrees - EPSILON) return -1;
        if (this.degrees > that.degrees + EPSILON) return +1;
        return 0;
    }

    public double getTemperature() {
        return degrees;
    }
    //...    
}
{% endhighlight %}


## A counterexample

{% highlight java %}
    public static void main(String[] args) {
        Temperature[] t = new Temperature[3];
        t[0] = new Temperature(10.00);
        t[1] = new Temperature(10.08);
        t[2] = new Temperature(10.16);
        Arrays.sort(t);
        for (Temperature s : t) {
            System.out.println(s.getTemperature() + " ");
        }
    }
{% endhighlight %}

Do you expect the output to be "10.00 10.08 10.16"?  If we shuffle t[0], t[1], t[2] in any order, can the sorting output **always** be "10.00 10.08 10.16"?

In the above test code, yes, the output is "10.00 10.08 10.16" which is what we want.

But if we change the order like this:
{% highlight java %}
        t[0] = new Temperature(10.16);
        t[1] = new Temperature(10.00);
        t[2] = new Temperature(10.08);
{% endhighlight %}

The output becomes "10.00 10.16 10.08"!  What is wrong?  Is EPSILON too large?  If so, how small EPSILON must be to get a stable sorting result?

## Analysis

Actually, however small EPSILON is, we can always find a counterexample to break the code in which the numbers are close enough.  For most cases, you can use `Double.MIN_VALUE` which is the smallest positive nonzero value of type double, as EPSILON, it is conceptually the same as .NET `Double.Epsilon`.  However, .NET document gives us this warning:

<pre>Double.Epsilon is sometimes used as an absolute measure of the distance
between two Double values when testing for equality. However, Double.Epsilon
measures the smallest possible value that can be added to, or subtracted from,
a Double whose value is zero. For most positive and negative Double values, the
value of Double.Epsilon is too small to be detected. Therefore, except for
values that are zero, we do not recommend its use in tests for equality.</pre>

So the above epsilon approach is not a reliable way to do the compare for sorting.

The root cause is that this `compareTo()` implementation violates the **Total Order** requirement in the specification of `compareTo()`.

### Total Order
- Antisymmetry: `a ≤ b` and `b ≤ a` implies `a = b`.
- Transitivity: `a ≤ b` and `b ≤ c` implies `a ≤ c`.
- Totality: either `a ≤ b` or `b ≤ a`.

See [Totally Ordered Set](http://mathworld.wolfram.com/TotallyOrderedSet.html) for a formal mathematical definition.

Suppose that a, b, and c refer to objects corresponding to temperatures of 10.16°, 10.08°, 10.00°, respectively.  Then,

- `a.compareTo(b) = 0`, we can say `a ≤ b`.
- `b.compareTo(c) = 0`, we can say `b ≤ c`.
- But `a.compareTo(c) > 0`, it implies `a > c`, which violates Transitivity property of total order.

## Conclusion

For the aforementioned reason, we **must not introduce a fudge factor** when comparing two floating-point numbers **if we want to implement the `Comparable` interface**.

We should always use the total order properties **to verify the correctness** of a `Comparable` implementation.

### How to compare floating-point numbers in Java?

The recommended way is to use `Double.compare()` or `Double.compareTo()` to compare doubles, and use `Float.compare()` or `Float.compareTo()` to compare floats.  They consider `NaN`, `0.0f` and `-0.0f`.  The _natural ordering_ imposed by these methods is consistent with _equals_.  To test the equality, use the overrided `equals()` methods, such as `Double.equals()`.  For more details, please read the documentation and the source code of the Java API.

The floating-point maths is complicated and hard.  For more discussions, please refer to [Comparing Floating Point Numbers](https://randomascii.wordpress.com/2012/02/25/comparing-floating-point-numbers-2012-edition/).

Reference: You may be interested in these two methods: `Math.nextAfter(double,double)`, and `Math.ulp(double)`.
