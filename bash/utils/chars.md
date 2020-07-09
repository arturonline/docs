# Special characters

<span class="anchor" id="line-9"></span><span class="anchor" id="line-10"></span><p class="line862">Some characters are evaluated by <a class="nonexistent" href="/Bash">Bash</a> to have a <em>non-literal</em> meaning.  Instead, these characters carry out a special instruction, or have an alternate meaning; they are called "special characters", or "meta-characters". <span class="anchor" id="line-11"></span><span class="anchor" id="line-12"></span></p><p class="line874">Here are some of the more common special characters uses: <span class="anchor" id="line-13"></span><span class="anchor" id="line-14"></span></p><div><table><tbody><tr>  <td><p class="line862"> <strong>Char.</strong> </p></td>
  <td><p class="line862"> <strong>Description</strong> </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-15"></span><p class="line862"> <tt class="backtick">"&nbsp;"</tt>  </p></td>
  <td><p class="line862"> <em>Whitespace</em> — this is a tab, newline, vertical tab, form feed, carriage return, or space.  Bash uses whitespace to determine where words begin and end.  The first word is the command name and additional words become arguments to that command. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-16"></span><p class="line862"> <tt class="backtick">$</tt>    </p></td>
  <td><p class="line862"> <em>Expansion</em> — introduces various types of expansion: parameter expansion (e.g. <tt class="backtick">$var</tt> or <tt class="backtick">${var}</tt>), <a href="/CommandSubstitution">command substitution</a> (e.g. <tt class="backtick">$(command)</tt>), or arithmetic expansion (e.g. <tt class="backtick">$((expression))</tt>).  More on expansions later. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-17"></span><p class="line862"> <tt class="backtick">''</tt>   </p></td>
  <td><p class="line862"> <em>Single quotes</em> — protect the text inside them so that it has a <em>literal</em> meaning.  With them, generally any kind of interpretation by Bash is ignored: special characters are passed over and multiple words are prevented from being split. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-18"></span><p class="line862"> <tt class="backtick">""</tt>   </p></td>
  <td><p class="line862"> <em>Double quotes</em> — protect the text inside them from being split into multiple words or arguments, yet allow substitutions to occur; the meaning of most other special characters is usually prevented. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-19"></span><p class="line862"> <tt class="backtick">\</tt>    </p></td>
  <td><p class="line862"> <em>Escape</em> — (backslash) prevents the next character from being interpreted as a special character.  This works outside of quoting, inside double quotes, and generally ignored in single quotes. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-20"></span><p class="line862"> <tt class="backtick">#</tt>    </p></td>
  <td><p class="line862"> <em>Comment</em> — the <tt class="backtick">#</tt> character begins a commentary that extends to the end of the line.  Comments are notes of explanation and are not processed by the shell. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-21"></span><p class="line862"> <tt class="backtick">=</tt>    </p></td>
  <td><p class="line862"> <em>Assignment</em> -- assign a value to a variable (e.g. <tt class="backtick">logdir=/var/log/myprog</tt>).  Whitespace is <em>not</em> allowed on either side of the <tt class="backtick">=</tt> character. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-22"></span><p class="line862"> <tt class="backtick">[[&nbsp;]]</tt> </p></td>
  <td><p class="line862"> <em>Test</em> — an evaluation of a conditional expression to determine whether it is "true" or "false".  Tests are used in Bash to compare strings, check the existence of a file, etc.  More of this will be covered later. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-23"></span><p class="line862"> <tt class="backtick">!</tt>    </p></td>
  <td><p class="line862"> <em>Negate</em> — used to negate or reverse a test or exit status.  For example: <tt class="backtick">!&nbsp;grep&nbsp;text&nbsp;file;&nbsp;exit&nbsp;$?</tt>. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-24"></span><p class="line862"> <tt class="backtick">&gt;</tt>, <tt class="backtick">&gt;&gt;</tt>, <tt class="backtick">&lt;</tt> </p></td>
  <td><p class="line862"> <em>Redirection</em> — redirect a command's <em>output</em> or <em>input</em> to a file.  Redirections will be covered later. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-25"></span><p class="line862"> <tt class="backtick">|</tt>    </p></td>
  <td><p class="line862"> <em>Pipe</em> — send the output from one command to the input of another command.  This is a method of chaining commands together.  Example: <tt class="backtick">echo&nbsp;"Hello&nbsp;beautiful."&nbsp;|&nbsp;grep&nbsp;-o&nbsp;beautiful</tt>. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-26"></span><p class="line862"> <tt class="backtick">;</tt>    </p></td>
  <td><p class="line862"> <em>Command separator</em> — used to separate multiple commands that are on the same line. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-27"></span><p class="line862"> <tt class="backtick">{&nbsp;}</tt>   </p></td>
  <td><p class="line862"> <em>Inline group</em> — commands inside the curly braces are treated as if they were one command.  It is convenient to use these when Bash syntax requires only one command and a function doesn't feel warranted. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-28"></span><p class="line862"> <tt class="backtick">(&nbsp;)</tt>   </p></td>
  <td><p class="line862"> <em>Subshell group</em> — similar to the above but where commands within are executed in a <a href="/SubShell">subshell</a> (a new process).  Used much like a sandbox, if a command causes side effects (like changing variables), it will have no effect on the current shell.  </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-29"></span><p class="line862"> <tt class="backtick">((&nbsp;))</tt> </p></td>
  <td><p class="line862"> <em>Arithmetic expression</em> — with an <a href="/ArithmeticExpression">arithmetic expression</a>, characters such as <tt class="backtick">+</tt>, <tt class="backtick">-</tt>, <tt class="backtick">*</tt>, and <tt class="backtick">/</tt> are mathematical operators used for calculations.  They can be used for variable assignments like <tt class="backtick">((&nbsp;a&nbsp;=&nbsp;1&nbsp;+&nbsp;4&nbsp;))</tt> as well as tests like <tt class="backtick">if&nbsp;((&nbsp;a&nbsp;&lt;&nbsp;b&nbsp;))</tt>.  More on this later. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-30"></span><p class="line862"> <tt class="backtick">$((&nbsp;))</tt> </p></td>
  <td><p class="line862"> <em>Arithmetic expansion</em> — Comparable to the above, but the expression is replaced with the result of its arithmetic evaluation.  Example: <tt class="backtick">echo&nbsp;"The&nbsp;average&nbsp;is&nbsp;$((&nbsp;(a+b)/2&nbsp;))"</tt>. </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-31"></span><p class="line862"> <tt class="backtick">*</tt>, <tt class="backtick">?</tt> </p></td>
  <td><p class="line862"> <em><a href="/glob">Globs</a></em> -- "wildcard" characters which match parts of filenames (e.g. <tt class="backtick">ls&nbsp;*.txt</tt>). </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-32"></span><p class="line862"> <tt class="backtick">~</tt>    </p></td>
  <td><p class="line862"> <em>Home directory</em> — the tilde is a representation of a home directory.  When alone or followed by a <tt class="backtick">/</tt>, it means the current user's home directory; otherwise, a username must be specified (e.g. <tt class="backtick">ls&nbsp;~/Documents;&nbsp;cp&nbsp;~john/.bashrc&nbsp;.</tt>). </p></td>
</tr>
<tr>  <td><span class="anchor" id="line-33"></span><p class="line862"> <tt class="backtick">&amp;</tt> </p></td>
  <td><p class="line862"> <em>Background</em> -- when used at the end of a command, run the command in the background (do not wait for it to complete). </p></td>
</tr>
</tbody></table></div><span class="anchor" id="line-34"></span><span class="anchor" id="line-35"></span><p class="line874">Examples: <span class="anchor" id="line-36"></span><span class="anchor" id="line-37"></span></p><p class="line867"><span class="anchor" id="line-38"></span><span class="anchor" id="line-39"></span><span class="anchor" id="line-40"></span><span class="anchor" id="line-41"></span><span class="anchor" id="line-42"></span><span class="anchor" id="line-43"></span><span class="anchor" id="line-44"></span><span class="anchor" id="line-45"></span><span class="anchor" id="line-46"></span><span class="anchor" id="line-47"></span><span class="anchor" id="line-48"></span><span class="anchor" id="line-49"></span><span class="anchor" id="line-50"></span><span class="anchor" id="line-51"></span><span class="anchor" id="line-52"></span></p><pre><span class="anchor" id="line-1"></span>$ echo "I am $LOGNAME"
<span class="anchor" id="line-2"></span>I am lhunath
<span class="anchor" id="line-3"></span>$ echo 'I am $LOGNAME'
<span class="anchor" id="line-4"></span>I am $LOGNAME
<span class="anchor" id="line-5"></span>$ # boo
<span class="anchor" id="line-6"></span>$ echo An open\ \ \ space
<span class="anchor" id="line-7"></span>An open   space
<span class="anchor" id="line-8"></span>$ echo "My computer is $(hostname)"
<span class="anchor" id="line-9"></span>My computer is Lyndir
<span class="anchor" id="line-10"></span>$ echo boo &gt; file
<span class="anchor" id="line-11"></span>$ echo $(( 5 + 5 ))
<span class="anchor" id="line-12"></span>10
<span class="anchor" id="line-13"></span>$ (( 5 &gt; 0 )) &amp;&amp; echo "Five is greater than zero."
<span class="anchor" id="line-14"></span>Five is greater than zero.</pre><span class="anchor" id="line-53"></span><span class="anchor" id="line-54"></span><p class="line867">
</p>