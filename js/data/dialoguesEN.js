/**
 * dialoguesEN.js - Full English dialogues, hints, and briefings for all 41 levels
 * Signal Factory v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    'use strict';

    SF.LEVEL_DIALOGUES_EN = {
        1: {
            before: "Foreman Unit-7: 'Let's begin with the basics: drag a rail track from IN to OUT.'",
            hint1: "Click on the circular pin of IN and drag a rail directly to OUT.",
            hint2: "Once connected, press the ▶ GO button in the toolbar above to start.",
            hint3: "The glowing rail carries the cargo packages straight across.",
            success: "Foreman: 'Excellent work. The direct line is fully operational.'",
            fail: "Foreman: 'Cargo failed to arrive. Verify your rail connection.'"
        },
        2: {
            before: "Foreman: 'Factory expanded with 2 independent channels: IN-A and IN-B. Route them to their matching targets.'",
            hint1: "Connect IN-A to OUT-A, and connect IN-B to OUT-B.",
            hint2: "Parallel rail tracks operate cleanly without interfering with each other.",
            hint3: "Drag two parallel lines across the board.",
            success: "Foreman: 'Very neat. Both pipelines are flowing smoothly.'",
            fail: "Foreman: 'Packages reached the wrong destination. Double-check your ports!'"
        },
        3: {
            before: "Foreman: 'Labels were swapped by accident. Route diagonally: IN-A to OUT-B, IN-B to OUT-A.'",
            hint1: "Rail tracks can freely cross over each other on the factory floor.",
            hint2: "Drag a line from IN-A down to OUT-B, and from IN-B up to OUT-A.",
            hint3: "Crossing rails swap the two data streams seamlessly.",
            success: "Foreman: 'Cargo rerouted and sorted properly.'",
            fail: "Foreman: 'Packages delivered to the wrong warehouse.'"
        },
        4: {
            before: "Foreman: 'We need to duplicate cargo. Drag a SPLITTER from the bottom tray onto the board.'",
            hint1: "Place a Splitter in the middle. Connect IN to the input pin on the left.",
            hint2: "Connect the two output pins on the right to OUT-A and OUT-B.",
            hint3: "The Splitter clones every incoming package into two identical packages simultaneously.",
            success: "Foreman: 'Doubled efficiency. Great progress.'",
            fail: "Foreman: 'Both target warehouses need a duplicate copy.'"
        },
        5: {
            before: "Foreman: 'Packages are tagged 0 or 1. Send tag 1 to OUT-A, and tag 0 to OUT-B using a DEMUX / SWITCH!'",
            hint1: "Place a Demux station. Route IN to its DATA input.",
            hint2: "Route the package itself into the SEL (Select) pin as well.",
            hint3: "Connect channel 0 (OUT0) to OUT-B, and channel 1 (OUT1) to OUT-A.",
            success: "Foreman: 'Well done. You picked up sorting logic very quickly.'",
            fail: "Foreman: 'Sorting error! Check the control SEL connection.'"
        },
        6: {
            before: "Foreman: 'Safety AND Gate: both sensor A and sensor B must agree on 1 for authorization.'",
            hint1: "Place an AND Gate onto the board.",
            hint2: "Connect IN-A to pin A, and IN-B to pin B of the AND Gate.",
            hint3: "Connect the output pin of the AND Gate to port OUT.",
            success: "Foreman: 'AND logic verified with precision.'",
            fail: "Foreman: 'The result violates the AND truth table. Both inputs must be 1 to pass.'"
        },
        7: {
            before: "Foreman: 'OR Gate: as long as at least ONE input channel is 1, the gate opens.'",
            hint1: "Deploy an OR Gate station.",
            hint2: "Route IN-A and IN-B to the two input pins of the OR Gate.",
            hint3: "Route the OR Gate output pin to OUT.",
            success: "Foreman: 'OR Gate line verified and active.'",
            fail: "Foreman: 'OR truth table: 0 OR 0 = 0, anything else is 1.'"
        },
        8: {
            before: "Foreman: 'The NOT Gate is an inverter. It turns 1 into 0, and 0 into 1.'",
            hint1: "Drag a NOT Gate station onto the board.",
            hint2: "Connect IN → NOT Gate → OUT.",
            hint3: "A single NOT Gate is all you need.",
            success: "Foreman: 'Signal inversion verified.'",
            fail: "Foreman: 'The signal has not been inverted!'"
        },
        9: {
            before: "Foreman: 'The XOR Gate only emits 1 when the two inputs are UNEQUAL (different from each other).'",
            hint1: "Place an XOR Gate station on the board.",
            hint2: "Route IN-A and IN-B into the XOR Gate inputs, and connect its output to OUT.",
            hint3: "When A != B, XOR outputs 1. When A == B, XOR outputs 0.",
            success: "Foreman: 'Phase mismatch alarm system operational and verified.'",
            fail: "Foreman: 'Incorrect output. When both inputs are identical, XOR must be 0.'"
        },
        10: {
            before: "Foreman: 'Master Security Lock: requires (A AND B) OR C to unlock the vault.'",
            hint1: "You need an AND Gate and an OR Gate.",
            hint2: "First feed IN-A and IN-B into the AND Gate.",
            hint3: "Then feed the AND output along with IN-C into the OR Gate, routing OR to OUT.",
            success: "Foreman: 'Security Lock engaged. Access to Floor 2 granted!'",
            fail: "Foreman: 'Lock denied. Check logic: (A AND B) OR C.'"
        },
        11: {
            before: "Foreman: 'Welcome to the Assembly Line. Connect numerical data packages through direct lines.'",
            hint1: "Direct rails carry full integers without rounding or modification.",
            hint2: "Connect IN directly to OUT.",
            hint3: "Watch the numerical badges on the carrier robots.",
            success: "Foreman: 'Assembly line throughput verified.'",
            fail: "Foreman: 'Data stream interrupted.'"
        },
        12: {
            before: "Foreman: 'The Adder station: combines the numerical value of A and B into a single package.'",
            hint1: "Deploy an Adder (+) station.",
            hint2: "Connect IN-A to pin A, and IN-B to pin B of the Adder.",
            hint3: "Connect the SUM output pin to OUT.",
            success: "Foreman: 'Arithmetic addition calculated cleanly.'",
            fail: "Foreman: 'Sum mismatch! Ensure both operands reach the Adder at the same tick.'"
        },
        13: {
            before: "Foreman: 'The Subtractor station: computes A minus B.'",
            hint1: "Deploy a Subtractor (-) station.",
            hint2: "Connect IN-A to minuend A, and IN-B to subtrahend B.",
            hint3: "Connect DIFF to OUT.",
            success: "Foreman: 'Subtraction completed with exact integer precision.'",
            fail: "Foreman: 'Difference check failed. Did you swap A and B?'"
        },
        14: {
            before: "Foreman: 'We need 3 times the incoming value (3 * N). But you only have Adders!'",
            hint1: "Remember: 3 * N = N + N + N.",
            hint2: "Split IN with a Splitter. Add IN + IN = 2N with one Adder.",
            hint3: "Add that 2N with the third copy of N using a second Adder to get 3N.",
            success: "Foreman: 'Multiplication synthesized purely out of adders!'",
            fail: "Foreman: 'Total is not 3 * N. Verify your two-stage addition.'"
        },
        15: {
            before: "Foreman: 'The Comparator: compares A against B, outputting 1 on A>B, A=B, or A<B.'",
            hint1: "Deploy a Comparator station.",
            hint2: "Connect IN-A and IN-B to pins A and B.",
            hint3: "Route the A>B output pin to OUT.",
            success: "Foreman: 'Threshold comparison validated.'",
            fail: "Foreman: 'Output pin error. Make sure you connected to A>B.'"
        },
        16: {
            before: "Foreman: 'Filter out negatives: only pass packages if their value is greater than 0.'",
            hint1: "Compare IN against a Constant 0 using a Comparator.",
            hint2: "Use the Comparator A>B pin as the control signal for a Filter station.",
            hint3: "Feed IN into the Filter DATA pin; when A>B is true, it passes through to OUT.",
            success: "Foreman: 'Positive stream isolated effectively.'",
            fail: "Foreman: 'Negative values leaked through. Tighten the filter!'"
        },
        17: {
            before: "Foreman: 'Compute the Absolute Value |N|: positive stays positive, negative flips to positive.'",
            hint1: "Check if N < 0 using a Comparator against Constant 0.",
            hint2: "If N < 0, compute 0 - N with a Subtractor to flip sign.",
            hint3: "Use a MUX to pick between the original N and the flipped (0 - N).",
            success: "Foreman: 'Absolute value calculation operates perfectly.'",
            fail: "Foreman: 'Negative numbers must be made positive.'"
        },
        18: {
            before: "Foreman: 'Threshold sorting: route packages < 10 to OUT-A, and >= 10 to OUT-B.'",
            hint1: "Deploy a Constant 10 and a Comparator.",
            hint2: "Compare IN against 10. Use the comparison result as the select input of a Demux.",
            hint3: "Route Demux outputs to OUT-A and OUT-B respectively.",
            success: "Foreman: 'Packages sorted across threshold boundary.'",
            fail: "Foreman: 'Threshold classification error.'"
        },
        19: {
            before: "Foreman: 'The Multiplexer (MUX): selects between channel 0 and channel 1 based on a control bit.'",
            hint1: "Connect channel 0 to pin A, and channel 1 to pin B of the MUX.",
            hint2: "Connect IN-SEL to the SEL pin of the MUX.",
            hint3: "Route the MUX output to OUT.",
            success: "Foreman: 'Channel switching responsive and timely.'",
            fail: "Foreman: 'Wrong channel selected. Verify 0 maps to A and 1 maps to B.'"
        },
        20: {
            before: "Foreman: 'Simple Cipher: encode packages with key K using XOR.'",
            hint1: "Feed the data stream and the key into an XOR Gate.",
            hint2: "Every byte will be masked by the key bitwise.",
            hint3: "Connect the XOR output to the secure OUT port.",
            success: "Foreman: 'Cipher encrypted successfully. Sector cleared!'",
            fail: "Foreman: 'Ciphertext corrupted. Ensure both streams align.'"
        },
        21: {
            before: "Foreman: 'Welcome to sequential logic! The Register station stores cargo across clock ticks.'",
            hint1: "Deploy a Register station.",
            hint2: "Connect IN to the DATA input of the Register.",
            hint3: "Route Register OUT to the factory OUT port.",
            success: "Foreman: 'First unit of memory successfully deployed.'",
            fail: "Foreman: 'Memory synchronization missed a tick.'"
        },
        22: {
            before: "Foreman: 'The Counter station: increments its count by 1 on every incoming pulse.'",
            hint1: "Deploy a Counter station.",
            hint2: "Connect the pulse signal to the PULSE pin of the Counter.",
            hint3: "Connect the COUNT output pin to OUT.",
            success: "Foreman: 'Tally counter operating accurately.'",
            fail: "Foreman: 'Count drift detected. Ensure pulse pin is triggered once per item.'"
        },
        23: {
            before: "Foreman: 'Accumulate a running total: output the sum of all packages seen so far.'",
            hint1: "Create a feedback loop with an Adder and a Register.",
            hint2: "Add incoming IN with the current value stored in the Register.",
            hint3: "Feed the sum back into the Register DATA pin and route to OUT.",
            success: "Foreman: 'Accumulator feedback loop running stably.'",
            fail: "Foreman: 'Accumulator drifted or overflowed. Verify the feedback loop.'"
        },
        24: {
            before: "Foreman: 'The Delay station: delays package delivery by exactly 1 clock tick.'",
            hint1: "Deploy a Delay station in series.",
            hint2: "Route IN → Delay → OUT.",
            hint3: "Notice the package pauses in the buffer for 1 full cycle.",
            success: "Foreman: 'Phase shifted by 1 tick cleanly.'",
            fail: "Foreman: 'Delay timing out of sync.'"
        },
        25: {
            before: "Foreman: 'Compare each item with its immediate predecessor (previous item).'",
            hint1: "Use a Delay station to hold the previous item.",
            hint2: "Feed current IN and delayed previous item into a Comparator.",
            hint3: "Output the comparison result to OUT.",
            success: "Foreman: 'Differential temporal comparison succeeded.'",
            fail: "Foreman: 'Comparison mismatch between current and previous ticks.'"
        },
        26: {
            before: "Foreman: 'Peak Detector: detect whenever current value is strictly greater than the previous.'",
            hint1: "Delay IN by 1 tick using a Delay station.",
            hint2: "Compare current IN with delayed IN using a Comparator.",
            hint3: "Output A>B to OUT.",
            success: "Foreman: 'Local peaks detected with laser precision.'",
            fail: "Foreman: 'False peak detected or peak missed.'"
        },
        27: {
            before: "Foreman: 'Compute the average of two inputs: (A + B) / 2.'",
            hint1: "First add A and B with an Adder (+).",
            hint2: "Then pass the sum through a Right Shift (÷2) station.",
            hint3: "Route the shifted output to OUT.",
            success: "Foreman: 'Average calculation completed without loss.'",
            fail: "Foreman: 'Rounding or arithmetic error in average computation.'"
        },
        28: {
            before: "Foreman: 'Generate the mini Fibonacci sequence: F(n) = F(n-1) + F(n-2).'",
            hint1: "You need two Registers in cascade to remember the last two values.",
            hint2: "Add them together with an Adder to compute the next term.",
            hint3: "Feed the sum back into the front Register.",
            success: "Foreman: 'Fibonacci harmonic generated autonomously!'",
            fail: "Foreman: 'Sequence diverged. Check initial register conditions.'"
        },
        29: {
            before: "Foreman: 'Parity Checker: output 1 if number of 1-bits is odd, 0 if even.'",
            hint1: "XOR is the classic parity accumulator: X ^ 0 = X, X ^ 1 = inverts.",
            hint2: "Accumulate parity across pulses using XOR and a 1-bit Register.",
            hint3: "Output the parity register state to OUT.",
            success: "Foreman: 'Parity check confirmed. Signal integrity guaranteed.'",
            fail: "Foreman: 'Parity bit mismatch.'"
        },
        30: {
            before: "Foreman: '2-to-4 Binary Decoder: decode 2 bits into 4 one-hot activation lines.'",
            hint1: "Use NOT gates to generate inverted A and B.",
            hint2: "Use AND gates: Line 0 = !A & !B, Line 1 = !A & B, Line 2 = A & !B, Line 3 = A & B.",
            hint3: "Route the 4 lines to OUT-0 through OUT-3.",
            success: "Foreman: 'Decoder fully synthesized. Clearance to Upper Tower granted!'",
            fail: "Foreman: 'Decoding address lines failed.'"
        },
        31: {
            before: "Foreman: 'The Multiplier: multiply two arbitrary integers A * B.'",
            hint1: "Decompose multiplication into conditional shifts and additions.",
            hint2: "Or accumulate A across B iterations using a Counter and Register loop.",
            hint3: "Connect the accumulated product to OUT.",
            success: "Foreman: 'Integer multiplier synthesized flawlessly.'",
            fail: "Foreman: 'Product mismatch. Check loop termination condition.'"
        },
        32: {
            before: "Foreman: 'Modulo operation: compute remainder of A divided by B (A % B).'",
            hint1: "Repeatedly subtract B from A while remaining value >= B.",
            hint2: "Use a Comparator to detect when remainder < B.",
            hint3: "Route the final non-negative remainder to OUT.",
            success: "Foreman: 'Modulo arithmetic verified.'",
            fail: "Foreman: 'Remainder calculation incorrect.'"
        },
        33: {
            before: "Foreman: 'Countdown Timer: start at N and decrement by 1 each tick until reaching 0.'",
            hint1: "Load N into a Register.",
            hint2: "Subtract 1 with a Subtractor each tick and feed back if > 0.",
            hint3: "Stop when zero is reached.",
            success: "Foreman: 'Countdown sequence executed on the dot.'",
            fail: "Foreman: 'Timer underflowed or missed zero tick.'"
        },
        34: {
            before: "Foreman: 'Power of Two: compute 2^N.'",
            hint1: "Start with 1 in a Register.",
            hint2: "Double the value (N + N with Adder) on each step.",
            hint3: "Count steps with a Counter until matching N.",
            success: "Foreman: 'Exponential curve generated smoothly.'",
            fail: "Foreman: 'Power calculation incorrect.'"
        },
        35: {
            before: "Foreman: 'Sort Two: take two inputs A and B, output min to OUT-0, max to OUT-1.'",
            hint1: "Compare A and B with a Comparator.",
            hint2: "Use two MUX stations controlled by A > B.",
            hint3: "Route min to OUT-0 and max to OUT-1.",
            success: "Foreman: 'Sorting network (size 2) verified.'",
            fail: "Foreman: 'Order inverted. Minimum must go to OUT-0.'"
        },
        36: {
            before: "Foreman: 'Sort Three: sort three numbers [A, B, C] in ascending order.'",
            hint1: "Build a 3-element sorting network using 3 comparator-swap blocks.",
            hint2: "Step 1: swap(A, B). Step 2: swap(B, C). Step 3: swap(A, B).",
            hint3: "Connect the 3 sorted lines to OUT-0, OUT-1, OUT-2.",
            success: "Foreman: 'Optimal 3-element sorting network complete.'",
            fail: "Foreman: 'Numbers not strictly sorted in ascending order.'"
        },
        37: {
            before: "Foreman: 'Palindrome Checker: check if the sequence is symmetric from front to back.'",
            hint1: "Store incoming items into a stack buffer or register array.",
            hint2: "Compare first with last, second with second-to-last.",
            hint3: "Output 1 if all pairs match, 0 if any mismatch.",
            success: "Foreman: 'Palindrome verification verified.'",
            fail: "Foreman: 'Symmetry check failed.'"
        },
        38: {
            before: "Foreman: 'XOR Multi-Round Cipher: decrypt a multi-layered encrypted signal stream.'",
            hint1: "Chain multiple XOR stages with the sequential round keys.",
            hint2: "Each stage strips one encryption layer.",
            hint3: "Route clear signal to OUT.",
            success: "Foreman: 'Cleartext decrypted! Central mainframe unlocked.'",
            fail: "Foreman: 'Decryption failed. Check key alignment.'"
        },
        39: {
            before: "Foreman: 'Binary Full Adder: 1-bit full adder with Carry-In and Carry-Out.'",
            hint1: "Sum = A ^ B ^ Cin.",
            hint2: "Cout = (A & B) | (Cin & (A ^ B)).",
            hint3: "Output Sum to OUT-SUM, and Cout to OUT-CARRY.",
            success: "Foreman: 'Full ALU addition block built from raw gates!'",
            fail: "Foreman: 'Sum or Carry bit calculation error.'"
        },
        40: {
            before: "Foreman: 'The Core Tower: validate the ultimate system packet flow to decide the fate of Signal Corp.'",
            hint1: "Synthesize everything you have mastered across all 40 floors.",
            hint2: "Route signals cleanly with minimum delay.",
            hint3: "All channels must balance at the final cycle.",
            success: "Foreman: 'You did it! The factory mainframe is under your command.'",
            fail: "Foreman: 'Core overload! Stabilize the feedback loops.'"
        },
        41: {
            before: "Glitch Cat: 'Meow... You reached the secret 41st Floor! Beyond the Tower, reality bends.'",
            hint1: "The Glitch Dimension has zero rail resistance.",
            hint2: "Follow the binary harmonic: 1, 0, 1, 1, 0, 1.",
            hint3: "Transmit the transcend signal to complete the secret ending.",
            success: "Glitch Cat: 'TRANSCENDENCE ACHIEVED! You discovered the true ending.'",
            fail: "Glitch Cat: 'Meow... Signal collapsed in the glitch void.'"
        }
    };
})(window.SF);
