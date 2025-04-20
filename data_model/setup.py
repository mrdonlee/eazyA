from setuptools import setup, find_packages

setup(
    name='data_model',
    version='0.1.0',
    author='Your Name',
    author_email='your.email@example.com',
    description='A Python package for retrieving data from an API and importing it as a DataFrame.',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[
        'pandas',
        'requests',
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.11',
)