'use client';

// mui
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import HomeStyle from '../home.styles';
export default function WelcomeDpwFoundation() {
  const theme = useTheme();
  const styles = HomeStyle(theme);
  return (
    <>
      <Box sx={[styles.bgGrey, styles.sectionPadding]}>
        <Container maxWidth="xl">
          <Typography variant="sectionHeader" align="left" color="text.secondarydark">
            WELCOME TO DP WORLD FOUNDATION
          </Typography>
          <Typography
            variant="body1Banner"
            align="left"
            color="text.secondarydark"
            component="div"
            sx={{
              mt: 3
            }}
          >
            The philanthropic arm of DP World, a global leader in port and logistics operations. Our mission is to
            create a world where every individual has the opportunity to lead a healthy and productive life. Founded in
            2022 under the visionary leadership of His Excellency Sultan bin Sulayem, our Foundation is dedicated to
            making a difference through impactful philanthropic efforts. We are committed to addressing pressing
            societal challenges across the regions where DP World operates. From the UAE and GCC to the Middle East,
            Africa, Sub-Saharan Africa, and beyond. We are dedicated to fostering sustainable development and
            environmental protection. Through our partnerships and initiatives, we aim to inspire positive change and
            build resilient communities.
          </Typography>
        </Container>
      </Box>
      <Box sx={[styles.bgGrey, styles.sectionPadding]}>
        <Stack
          justifyContent="flex-end"
          sx={{
            position: 'relative',
            maxHeight: '500px',
            [theme.breakpoints.down('md')]: {
              maxHeight: 'fit-content'
            }
          }}
        >
          <Box sx={styles.boxLeftImage}>
            <Image
              width={500}
              height={500}
              src="/images/ourvision-mission.jpg"
              alt="Foundation Image"
              unoptimized
              style={{
                width: '100%',
                height: 'auto'
              }}
            />
          </Box>
          <Container sx={[styles.boxRightContent, { alignItems: 'center' }]} maxWidth="xl">
            <Box>
              <Stack flexDirection="column" spacing={4}>
                <Box pr={8}>
                  <Typography
                    component="h5"
                    variant="sectionHeaderSmall"
                    color="text.secondarydark"
                    textTransform="uppercase"
                    mb={2}
                  >
                    Our Vision
                  </Typography>
                  <Typography variant="body1Banner" color="text.secondarydark">
                    Working towards a world where every person has the opportunity to lead a healthy and productive
                    life, inspiring global change through humanitarian work that proudly embodies the UAE's values.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component="h5"
                    variant="sectionHeaderSmall"
                    color="text.secondarydark"
                    textTransform="uppercase"
                    mb={2}
                  >
                    Our Mission
                  </Typography>
                  <Typography variant="body1Banner" color="text.secondarydark">
                    Empower communities through focused support in health, education, and food. Working together with
                    partners to create real and meaningful improvements that can be measured.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Container>
        </Stack>
      </Box>
      <Box sx={[styles.bgGrey, styles.sectionPadding]}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{
            position: 'relative',
            height: '600px',
            [theme.breakpoints.down('md')]: {
              height: 'fit-content',
              flexDirection: 'column-reverse'
            }
          }}
        >
          <Container sx={styles.boxLeftContent} maxWidth="xl">
            <Box sx={{ pr: { xs: 0, md: 5 } }}>
              <Typography
                component="h4"
                variant="sectionHeader"
                color="text.secondarydark"
                textTransform="uppercase"
                mb={3}
              >
                Core Pillars
              </Typography>
              <Box
                sx={{
                  height: '550px',
                  overflowY: 'auto',
                  [theme.breakpoints.down('md')]: {
                    height: 'auto',
                    overflowY: 'visible'
                  }
                }}
              >
                <Stack flexDirection="column" spacing={3}>
                  <Box>
                    <Typography
                      component="h5"
                      variant="sectionHeaderSmall"
                      color="text.secondarydark"
                      textTransform="uppercase"
                    >
                      Health
                    </Typography>
                    <Typography variant="body1Banner" color="text.secondarydark">
                      DP World Foundation is committed to enhancing global Health, providing communities with access to
                      medical care, preventive services, and health education. We champion initiatives that promote
                      well-being, combat diseases, and strengthen healthcare systems for a healthier future.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      component="h5"
                      variant="sectionHeaderSmall"
                      color="text.secondarydark"
                      textTransform="uppercase"
                    >
                      Food
                    </Typography>
                    <Typography variant="body1Banner" color="text.secondarydark">
                      DP World Foundation prioritises Food as a fundamental pillar, striving to eradicate hunger and
                      ensure access to nutritious meals for communities worldwide. Our programmes focus on sustainable
                      agriculture, food distribution, and education to foster food security and well-being.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      component="h5"
                      variant="sectionHeaderSmall"
                      color="text.secondarydark"
                      textTransform="uppercase"
                    >
                      Education
                    </Typography>
                    <Typography variant="body1Banner" color="text.secondarydark">
                      At the heart of our mission, Education is key to unlocking potential and driving societal
                      progress. DP World Foundation invests in learning initiatives, scholarships, and educational
                      resources, aiming to provide inclusive, quality education and lifelong learning opportunities for
                      all.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Container>
          <Box
            sx={[
              styles.boxRightImage,
              {
                position: 'sticky',
                top: 0,
                [theme.breakpoints.down('md')]: {
                  position: 'relative'
                }
              }
            ]}
          >
            <Image
              width={0}
              height={800}
              src="/images/core-pillars.jpg"
              alt="Foundation Image"
              unoptimized
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        </Stack>
      </Box>
      <Box sx={[styles.bgGrey, styles.sectionPadding]}>
        <Stack
          justifyContent="flex-end"
          sx={{
            position: 'relative',
            height: '450px',
            [theme.breakpoints.down('md')]: {
              height: 'fit-content'
            }
          }}
        >
          <Box
            sx={[
              styles.boxLeftImage,
              {
                position: 'sticky',
                top: 0,
                height: '100%',
                [theme.breakpoints.down('md')]: {
                  position: 'relative'
                }
              }
            ]}
          >
            <Image
              width={0}
              height={550}
              src="/images/essential-focus-area.jpg"
              alt="Foundation Image"
              unoptimized
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          <Container sx={styles.boxRightContent} maxWidth="xl">
            <Box>
              <Typography
                component="h4"
                variant="sectionHeader"
                color="text.secondarydark"
                textTransform="uppercase"
                mb={3}
              >
                Essential Focus Areas
              </Typography>
              <Box
                sx={{
                  height: '370px',
                  overflowY: 'auto',
                  [theme.breakpoints.down('md')]: {
                    height: 'auto',
                    overflowY: 'visible'
                  }
                }}
              >
                <Stack flexDirection="column" spacing={3}>
                  <Box>
                    <Typography
                      component="h5"
                      variant="sectionHeaderSmall"
                      color="text.secondarydark"
                      textTransform="uppercase"
                      mb={3}
                    >
                      Emergency Relief
                    </Typography>
                    <Typography variant="body1Banner" color="text.secondarydark">
                      DP World Foundation is steadfast in its commitment to providing timely Emergency Relief during
                      crises. We mobilise resources, deliver essential aid, and work on ground to alleviate suffering,
                      aiding communities affected by natural disasters, conflicts, and emergencies.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      component="h5"
                      variant="sectionHeaderSmall"
                      color="text.secondarydark"
                      textTransform="uppercase"
                      mb={3}
                    >
                      Social Responsibility
                    </Typography>
                    <Typography variant="body1Banner" color="text.secondarydark">
                      Social Responsibility is integral to our ethos at DP World Foundation. We actively contribute to
                      societal development, championing sustainable practices, ethical operations, and community
                      engagement. Our initiatives foster social equity, environmental stewardship, and positive change.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Container>
        </Stack>
      </Box>
    </>
  );
}
