// Mahina — Jetpack Compose theme (Material 3).
// Drop into app/src/main/java/<package>/ui/theme/ and copy the TTFs from
// android-ui-kit/assets/fonts into app/src/main/res/font/ (names already Android-safe).
// Light theme only for v1: the brand relies on the "paper register" look.

package app.mahina.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
// import app.mahina.R

object MahinaColors {
    val Ink = Color(0xFF2433A6)
    val InkDark = Color(0xFF1A2580)
    val InkSoft = Color(0xFFEEF1FF)
    val InkLight = Color(0xFFC9D3FF)
    val Paid = Color(0xFF0E7A4E)
    val PaidSoft = Color(0xFFE4F4EC)
    val Due = Color(0xFFC2410C)
    val DueSoft = Color(0xFFFDEEE4)
    val Margin = Color(0xFFE3474F)
    val Rule = Color(0xFFD9E3F2)
    val Text = Color(0xFF161A2C)
    val Muted = Color(0xFF5B6178)
    val Surface = Color(0xFFF5F7FB)
    val Card = Color(0xFFFFFFFF)
    val Line = Color(0xFFE3E7F0)
    val WhatsApp = Color(0xFF25D366)
    val OnWhatsApp = Color(0xFF0B3D20)
    val ChatBubble = Color(0xFFD9FDD3)
    val Scrim = Color(0x730D1240)
}

/** Brand colours Material doesn't have slots for. Read with MahinaTheme.extra. */
@Immutable
data class MahinaExtraColors(
    val paid: Color = MahinaColors.Paid,
    val paidSoft: Color = MahinaColors.PaidSoft,
    val due: Color = MahinaColors.Due,
    val dueSoft: Color = MahinaColors.DueSoft,
    val whatsapp: Color = MahinaColors.WhatsApp,
    val onWhatsapp: Color = MahinaColors.OnWhatsApp,
    val chatBubble: Color = MahinaColors.ChatBubble,
    val rule: Color = MahinaColors.Rule,
    val margin: Color = MahinaColors.Margin,
    val line: Color = MahinaColors.Line,
    val muted: Color = MahinaColors.Muted,
)

val LocalMahinaExtra = staticCompositionLocalOf { MahinaExtraColors() }

private val LightScheme = lightColorScheme(
    primary = MahinaColors.Ink,
    onPrimary = Color.White,
    primaryContainer = MahinaColors.InkSoft,
    onPrimaryContainer = MahinaColors.Ink,
    secondary = MahinaColors.Paid,
    onSecondary = Color.White,
    secondaryContainer = MahinaColors.PaidSoft,
    onSecondaryContainer = MahinaColors.Paid,
    error = MahinaColors.Due,
    onError = Color.White,
    errorContainer = MahinaColors.DueSoft,
    onErrorContainer = MahinaColors.Due,
    background = MahinaColors.Surface,
    onBackground = MahinaColors.Text,
    surface = MahinaColors.Card,
    onSurface = MahinaColors.Text,
    surfaceVariant = MahinaColors.Surface,
    onSurfaceVariant = MahinaColors.Muted,
    surfaceContainerLow = MahinaColors.Card,
    surfaceContainer = MahinaColors.Card,
    surfaceContainerHigh = MahinaColors.Card,
    outline = MahinaColors.Line,
    outlineVariant = MahinaColors.Line,
    scrim = MahinaColors.Scrim,
)

// Variable fonts: one file, weights selected via FontVariation (API 26+).
// Uncomment once the TTFs are in res/font and R is imported.
@OptIn(androidx.compose.ui.text.ExperimentalTextApi::class)
private fun variable(resId: Int, weight: Int) =
    Font(resId, FontWeight(weight), variationSettings = FontVariation.Settings(FontVariation.weight(weight)))

val DisplayFamily: FontFamily = FontFamily.Default /* FontFamily(
    variable(R.font.bricolage_grotesque_variable, 700),
    variable(R.font.bricolage_grotesque_variable, 800),
) */

val BodyFamily: FontFamily = FontFamily.Default /* FontFamily(
    variable(R.font.hanken_grotesk_variable, 400),
    variable(R.font.hanken_grotesk_variable, 500),
    variable(R.font.hanken_grotesk_variable, 600),
    variable(R.font.hanken_grotesk_variable, 700),
) */

val HandFamily: FontFamily = FontFamily.Cursive /* FontFamily(Font(R.font.kalam_regular_latin)) */

val MahinaTypography = Typography(
    displayLarge = TextStyle(fontFamily = DisplayFamily, fontWeight = FontWeight.ExtraBold, fontSize = 34.sp, lineHeight = 38.sp, letterSpacing = (-0.02).em),
    headlineMedium = TextStyle(fontFamily = DisplayFamily, fontWeight = FontWeight.ExtraBold, fontSize = 26.sp, lineHeight = 30.sp, letterSpacing = (-0.015).em),
    titleLarge = TextStyle(fontFamily = DisplayFamily, fontWeight = FontWeight.Bold, fontSize = 20.sp, lineHeight = 26.sp),
    titleMedium = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 22.sp),
    bodyLarge = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp),
    labelLarge = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, lineHeight = 20.sp),
    labelMedium = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, lineHeight = 16.sp),
    labelSmall = TextStyle(fontFamily = BodyFamily, fontWeight = FontWeight.Bold, fontSize = 11.sp, lineHeight = 14.sp),
)

/** Big rupee figures in stat cards. */
val StatValueStyle = TextStyle(fontFamily = DisplayFamily, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp, lineHeight = 28.sp, letterSpacing = (-0.01).em)

val MahinaShapes = Shapes(
    extraSmall = RoundedCornerShape(5.dp),   // stamps
    small = RoundedCornerShape(12.dp),       // buttons, fields
    medium = RoundedCornerShape(16.dp),      // cards
    large = RoundedCornerShape(24.dp),       // sheets
    extraLarge = RoundedCornerShape(28.dp),
)

@Composable
fun MahinaTheme(content: @Composable () -> Unit) {
    androidx.compose.runtime.CompositionLocalProvider(LocalMahinaExtra provides MahinaExtraColors()) {
        MaterialTheme(colorScheme = LightScheme, typography = MahinaTypography, shapes = MahinaShapes, content = content)
    }
}

object MahinaTheme {
    val extra: MahinaExtraColors
        @Composable get() = LocalMahinaExtra.current
}
